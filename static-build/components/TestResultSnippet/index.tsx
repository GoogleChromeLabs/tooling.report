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
  details: string;
  link: string;
}

const TestResultSnippet: FunctionalComponent<Props> = ({
  name,
  result,
  details,
  link,
}: Props) => {
  return (
    <li class={$resultItem}>
      <a href="#" class={$toolName}>
        {name}
      </a>
      <figure class={$toolIcon}>
        <img /*src={toolImages[name]}*/ src={webpack} alt="" />
      </figure>
      <div data-result={result} class={$toolBadge}>
        {result}
      </div>
      <div>
        <div dangerouslySetInnerHTML={{ __html: details }}></div>
      </div>
      <a href={link}>Inspect the Test</a>
    </li>
  );
};

export default TestResultSnippet;
