import { h } from 'preact';
import { $datagrid, $row, $column, $dot } from './styles.css';

const mockdata = [
  [[9], [12], [7], [8]],
  [[8], [15], [5], [4]],
  [[7], [8], [3], [7]],
  [[12], [4], [11], [12]],
];

const randomResult = () => {
  const results = ['pass', 'fail', 'partial', 'skip'];

  const max = results.length;
  const seed = Math.floor(Math.random() * Math.floor(max));

  return results[seed];
};

function DataGrid() {
  return (
    <div class={$datagrid}>
      {mockdata.map(row => (
        <div class={$row}>
          {row.map(column => (
            <span class={$column}>
              {Array.apply(null, Array(column[0])).map(dots => (
                <span data-result={randomResult()} class={$dot}></span>
              ))}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default DataGrid;
