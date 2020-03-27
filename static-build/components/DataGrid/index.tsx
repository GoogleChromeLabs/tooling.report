import { h, FunctionalComponent, JSX } from 'preact';
import config from 'consts:config';
import { renderIssueLinksForTest } from '../../utils.js';
import { calculateScore } from 'static-build/utils';
import { $datagrid, $row, $column, $dot, $aside, $results } from './styles.css';

interface Props {
  tests?: Tests;
  basePath: string;
}

function renderTest(test: Test, basePath: string): JSX.Element {
  let results: JSX.Element[] | undefined;

  if (test.results) {
    results = Object.entries(test.results).map(([subject, result]) => (
      <li>
        {subject}:{' '}
        {result.meta.result === 'pass'
          ? 'Pass'
          : result.meta.result === 'fail'
          ? 'Fail'
          : 'So-so'}
      </li>
    ));
  }

  return (
    <div>
      <h4>{test.meta.title}</h4>
      <ul>
        {config.testSubjects.map(subject => {
          const { score, possible } = calculateScore(test, subject);
          return (
            <li>
              {subject}: {score}/{possible}
              {renderIssueLinksForTest(test, subject)}
            </li>
          );
        })}
      </ul>
      <p>
        <a href={basePath}>More details</a>
      </p>
      {results && <ul>{results}</ul>}
      {test.subTests && (
        <section>{renderTests(test.subTests, basePath)}</section>
      )}
    </div>
  );
}

function renderTests(tests: Tests, basePath = '/'): JSX.Element[] {
  return Object.entries(tests).map(([testDir, test]) =>
    renderTest(test, `${basePath}${testDir}/`),
  );
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
            <a href="#">{test.meta && test.meta.title}</a>
          </div>
          <div class={$results}>
            {test.results &&
              Object.entries(test.results).map(([subject, result]) => (
                <span class={$column}>
                  <span data-result={result.meta.result} class={$dot}></span>
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataGrid;
