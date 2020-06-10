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
import { h, FunctionalComponent } from 'preact';
import config from 'consts:config';
import {
  $datagrid,
  $row,
  $column,
  $aside,
  $results,
  $dotContainer,
  $dotButton,
} from './styles.css';
import Dot from '../Dot';

interface Props {
  tests?: Tests;
  basePath: string;
  collectionTitle: string;
}

function flattenTests(testDir: string, test: Test, results: Tests = {}): Tests {
  results[testDir] = test;

  if (test.subTests) {
    for (const [subTestDir, subTest] of Object.entries(test.subTests)) {
      flattenTests(testDir + subTestDir + '/', subTest, results);
    }
  }

  return results;
}

const DataGrid: FunctionalComponent<Props> = ({
  tests = {},
  basePath,
  collectionTitle,
}: Props) => {
  const testGroups = Object.entries(tests).map(([testDir, test]) =>
    flattenTests(testDir + '/', test),
  );

  return (
    <div class={$datagrid}>
      {testGroups.map(tests => {
        const testEntries = Object.entries(tests);
        const [mainTestDir, mainTest] = testEntries[0];

        return (
          <div class={$row}>
            <div class={$aside}>
              <a href={`${basePath}${mainTestDir}`}>
                {mainTest.meta && mainTest.meta.title}
              </a>
            </div>
            <div class={$results}>
              {config.testSubjects.map(tool => (
                <span class={$column}>
                  {testEntries.map(
                    ([testDir, test]) =>
                      test.results[tool] && (
                        <div class={$dotContainer}>
                          <grid-tooltip
                            innerid={`${tool}-${testDir}`}
                            result={test.results[tool].meta.result}
                            tool={tool as BuildTool}
                            category={
                              mainTest !== test
                                ? mainTest.meta.title
                                : collectionTitle
                            }
                            testname={test.meta.title}
                            href={`${basePath}${testDir}`}
                            content={test.meta.shortDesc}
                          >
                            <button
                              aria-describedby={`${tool}-${testDir}`}
                              class={$dotButton}
                            >
                              <Dot result={test.results[tool].meta.result} />
                            </button>
                          </grid-tooltip>
                        </div>
                      ),
                  )}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DataGrid;
