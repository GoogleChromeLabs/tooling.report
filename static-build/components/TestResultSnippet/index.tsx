import { h, FunctionalComponent } from 'preact';
import { $resultItem, $toolIcon, $toolName, $toolBadge } from './styles.css';
import browserify from 'asset-url:../../img/browserify.svg';
import rollup from 'asset-url:../../img/rollup.svg';
import webpack from 'asset-url:../../img/webpack.svg';
import parcel from 'asset-url:../../img/parcel.svg';
const toolImages = { browserify, rollup, webpack, parcel };

interface Props {
  name: string;
  result: string;
}

const TestResultSnippet: FunctionalComponent<Props> = ({
  name,
  result,
}: Props) => {
  return (
    <li class={$resultItem}>
      <a href={`#${name}`} title={`Explain the ${result}`} class={$toolName}>
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
