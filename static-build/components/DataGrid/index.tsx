import { h, FunctionalComponent, JSX } from 'preact';
import config from 'consts:config';
import { $datagrid, $row, $column, $dot, $aside, $results } from './styles.css';
import ToolTip from '../../components/ToolTip';

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
        const [testDir, mainTest] = Object.entries(tests)[0];

        return (
          <div class={$row}>
            <div class={$aside}>
              <a href={`${basePath}${testDir}`}>
                {mainTest.meta && mainTest.meta.title}
              </a>
            </div>
            <div class={$results}>
              {config.testSubjects.map(tool => (
                <span class={$column}>
                  {Object.entries(tests).map(
                    ([testDir, test]) =>
                      test.results[tool] && (
                        <div style="position: relative">
                          <button
                            aria-describedby={`${tool}-${testDir}`}
                            data-tool={tool}
                            data-result={test.results[tool].meta.result}
                            class={$dot}
                          ></button>
                          <ToolTip
                            id={`${tool}-${testDir}`}
                            result={test.results[tool].meta.result}
                            tool={tool as BuildTool}
                            category={
                              mainTest !== test
                                ? mainTest.meta.title
                                : collectionTitle
                            }
                            name={test.meta.title}
                            link={`${basePath}${testDir}`}
                            content={test.meta.shortDesc}
                          />
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
