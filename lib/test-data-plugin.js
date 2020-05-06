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

/**
 * Returns object with test details, results, and sub-tests for pathArr.
 *
 * @param {string[]} pathArr Path to read, as an array of strings.
 */
async function readTest(pathArr, rollupContext) {
  // `markdownKey` is used to generate an `import` statement and
  // as such the path needs to use `/`, even on windows.
  // So don’t use `joinpath()` here!
  const importPath = pathArr.join('/');

  const entries = await fs.readdir(joinPath(...pathArr), {
    withFileTypes: true,
  });

  const hasIndex = entries.some(
    entry => entry.isFile() && entry.name === 'index.md',
  );
  if (!hasIndex) throw Error(`Cannot find ${importPath}/index.md`);

  const hasSubtests = entries.some(
    entry => entry.isDirectory() && entry.name === subtestFolderName,
  );
  const dirs = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const test = {
    [markdownKey]: `${importPath}/index.md`,
    results: Object.fromEntries(
      testSubjects
        .filter(subject => {
          const hasResult = dirs.includes(subject);
          if (!hasResult && !hasSubtests) {
            rollupContext.warn(`Missing ${subject} test for ${importPath}`);
          }
          return hasResult;
        })
        .map(subject => [
          subject,
          {
            [markdownKey]: `${importPath}/${subject}/index.md`,
            repositoryPath: `${importPath}/${subject}`,
          },
        ])
        .sort(([a], [b]) => (a > b ? 1 : -1)),
    ),
  };

  if (hasSubtests) {
    test.subTests = await readTests(
      [...pathArr, subtestFolderName],
      rollupContext,
    );
  }

  return test;
}

/**
 * Returns object of tests, where each test is a subdirectory of `pathArr`.
 *
 * @param {string[]} pathArr Path to read, as an array of strings.
 */
async function readTests(pathArr, rollupContext) {
  const entries = await fs.readdir(joinPath(...pathArr), {
    withFileTypes: true,
  });

  const dirs = entries
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => entry.name);

  return Object.fromEntries(
    await Promise.all(
      dirs.map(async dir => [
        dir,
        await readTest([...pathArr, dir], rollupContext),
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
      const obj = await readTests(['tests'], this);
      return createModule(obj);
    },
  };
}
