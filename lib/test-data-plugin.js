/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { promises as fs } from 'fs';
import { join as joinPath } from 'path';
import { testSubjects } from '../config.js';

const testDataId = 'test-data:';
const subtestFolderName = 'subtests';
const markdownKey = '__mdReplace__';
const markdownRe = /"__mdReplace__":"([^"]+)"/g;
// If these are updated, make sure the README is also updated.

/**
 * Returns the full path of the folder containing the subtests.
 * Does not test if that folder actually exists.
 *
 * @param {string[]} pathArr Path to a test folder
 * @returns {string} Full path to the subtest folder
 */
function subtestFolder(pathArr) {
  // If pathArr only contains 1 item, it’s the `test` folder where we
  // don’t require a `subtests` folder.
  if (pathArr.length === 1) {
    return joinPath(...pathArr);
  }
  return joinPath(...pathArr, subtestFolderName);
}

/**
 * Asynchronously checks if a file or folder exists.
 *
 * @param {string} path Path to file or folder
 * @returns {Promise<boolean>} True if the file or folder exists. False otherwise.
 */
async function fileExists(path) {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
}

/**
 * Asynchronously checks if a folder contains subtests.
 *
 * @param {string} path Path to file or folder
 * @returns {Promise<boolean>} True if the folder contains subtests.
 */
function containsSubtests(pathArr) {
  // If pathArr only contains 1 item, it’s the `test` folder where we
  // don’t require a `subtests` folder.
  if (pathArr.length === 1) {
    return true;
  }
  return fileExists(subtestFolder(pathArr));
}

/**
 * Returns names of markdown files and sub-test directories in `pathArr`.
 *
 * @param {string[]} pathArr Path to read, as an array of strings.
 */
async function readTestDir(pathArr) {
  const entries = await fs.readdir(joinPath(...pathArr), {
    withFileTypes: true,
  });
  const markdowns = entries
    .filter(entry => entry.isDirectory() && entry.name !== subtestFolderName)
    .map(entry => joinPath(entry.name, 'index.md'));
  // We *expect* an index.md for the test suite.
  markdowns.push('index.md');
  const subTests = [];
  if (await containsSubtests(pathArr)) {
    const entries = await fs.readdir(subtestFolder(pathArr), {
      withFileTypes: true,
    });
    subTests.push(
      ...entries
        .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
        .map(entry => entry.name),
    );
  }

  return { markdowns, subTests };
}

/**
 * Returns object with test details, results, and sub-tests for pathArr.
 *
 * @param {string[]} pathArr Path to read, as an array of strings.
 */
async function readTest(pathArr) {
  const { markdowns, subTests } = await readTestDir(pathArr);
  // `markdownKey` is used to generate an `import` statement and
  // as such the path needs to use `/`, even on windows.
  // So don’t use `joinpath()` here!
  const joinedPath = pathArr.join('/');

  if (!markdowns.includes('index.md')) {
    throw Error(`Cannot find ${joinedPath}/index.md`);
  }

  const test = {
    [markdownKey]: `${joinedPath}/index.md`,
    results: Object.fromEntries(
      testSubjects
        .filter(subject => markdowns.includes(`${subject}/index.md`))
        .map(subject => [
          subject,
          { [markdownKey]: [...pathArr, subject, 'index.md'].join('/') },
        ]),
    ),
  };

  if (subTests.length !== 0) {
    test.subTests = await readTests([...pathArr, subtestFolderName], subTests);
  }

  return test;
}

/**
 * Returns an object of test results indexed by dir name.
 *
 * @param {string[]} pathArr Path to read, as an array of strings.
 * @param {string[]} testDirs Test directories to read within `pathArr`.
 */
async function readTests(pathArr, testDirs) {
  return Object.fromEntries(
    await Promise.all(
      testDirs.map(async testDir => [
        testDir,
        await readTest([...pathArr, testDir]),
      ]),
    ),
  );
}

/**
 * Converts this object into a full module.
 * Object keys __mdReplace__ & values are replaced with a markdown import.
 *
 * @param {*} testObj An object returned by `readTests`.
 */
function createModule(testObj) {
  const objStr = JSON.stringify(testObj);
  let importCounter = 0;
  let importStr = '';

  const exportObjStr = objStr.replace(markdownRe, (_, markdownPath) => {
    const importName = 'md' + importCounter++;
    importStr += `import * as ${importName} from ${JSON.stringify(
      'md:' + markdownPath,
    )};`;
    return `html:${importName}.html,meta:${importName}.meta`;
  });
  return importStr + 'export default ' + exportObjStr;
}

export default function testDataPlugin() {
  return {
    name: 'test-data-plugin',
    resolveId(id) {
      if (id === testDataId) return id;
    },
    async load(id) {
      if (id !== testDataId) return;
      this.addWatchFile('tests');
      const pathArr = ['tests'];
      const { subTests } = await readTestDir(pathArr);
      const obj = await readTests(pathArr, subTests);
      return createModule(obj);
    },
  };
}
