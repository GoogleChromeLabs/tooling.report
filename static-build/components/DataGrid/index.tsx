import { h, FunctionalComponent, JSX } from 'preact';
import config from 'consts:config';
import { $datagrid, $row, $column, $dot, $aside, $results } from './styles.css';
import ToolTip from '../../components/ToolTip';

interface Props {
  tests?: Tests;
  basePath: string;
}

function gatherSubtestResults(
  test: Test,
  tool: BuildTool,
  tests: Tests,
): Tests {
  if (test.results[tool]) {
    tests[test.meta.title] = test;
  }

  if (test.subTests) {
    Object.entries(test.subTests).map(([testDir, t]) =>
      gatherSubtestResults(t, tool, tests),
    );
  }

  return tests;
}

const DataGrid: FunctionalComponent<Props> = ({
  tests = {},
  basePath,
}: Props) => {
  return (
    <div class={$datagrid}>
      {Object.entries(tests).map(([testDir, test]) => (
        <div class={$row}>
          <div class={$aside}>
            <a href={`${basePath}${testDir}`}>{test.meta && test.meta.title}</a>
          </div>
          <div class={$results}>
            {test.results &&
              Object.entries(test.results).map(([subject, result]) => (
                <span class={$column}>
                  <div style="position: relative">
                    <button
                      aria-describedby={`${subject}-${testDir}`}
                      data-tool={subject}
                      data-result={result.meta.result}
                      class={$dot}
                    ></button>
                    <ToolTip
                      id={`${subject}-${testDir}`}
                      result={result.meta.result}
                      tool={subject}
                      category={'TBD'} //TODO
                      name={test.meta.title}
                      link={`${basePath}${testDir}`}
                      content={test.meta.shortDesc}
                    />
                  </div>
                </span>
              ))}
            {test.subTests &&
              config.testSubjects.map(tool => (
                <span class={$column}>
                  {Object.entries(gatherSubtestResults(test, tool, {})).map(
                    ([subject, test]) => (
                      // TODO: Subtest DataGrid Tooltip
                      <div style="position: relative">
                        <button
                          aria-describedby={`${subject}-${testDir}`}
                          data-tool={subject}
                          data-result={test.results[tool].meta.result}
                          class={$dot}
                        ></button>
                        <ToolTip
                          id={`${subject}-${testDir}`}
                          result={test.results[tool].meta.result}
                          tool={subject}
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
      ))}
    </div>
  );
};

export default DataGrid;
