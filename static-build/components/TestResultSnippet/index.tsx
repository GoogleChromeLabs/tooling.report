import { h, FunctionalComponent } from 'preact';
import { $resultItem, $toolIcon, $toolName, $toolBadge } from './styles.css';
import gulp from 'asset-url:../../img/gulp.svg';
import rollup from 'asset-url:../../img/rollup.svg';
import webpack from 'asset-url:../../img/webpack.svg';
import parcel from 'asset-url:../../img/parcel.svg';
const toolImages = { gulp, rollup, webpack, parcel };

interface Props {
  name: string;
  result: string;
  link: string;
}

const TestResultSnippet: FunctionalComponent<Props> = ({
  name,
  result,
  link,
}: Props) => {
  return (
    <li class={$resultItem}>
      <a href={link} class={$toolName}>
        {name}
      </a>
      <figure class={$toolIcon}>
        <img src={toolImages[name as BuildTool]} alt="" />
      </figure>
      <div data-result={result} class={$toolBadge}>
        {result}
      </div>
    </li>
  );
};

export default TestResultSnippet;
