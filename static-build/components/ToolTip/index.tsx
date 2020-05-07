import { h, FunctionalComponent } from 'preact';
import {
  $tooltip,
  $toolBadge,
  $headerBar,
  $headerMeta,
  $details,
  $toolIcon,
} from './styles.css';
import gulp from 'asset-url:../../img/gulp.svg';
import rollup from 'asset-url:../../img/rollup.svg';
import webpack from 'asset-url:../../img/webpack.svg';
import parcel from 'asset-url:../../img/parcel.svg';
const toolImages = { gulp, rollup, webpack, parcel };

interface Props {
  content: string;
  id: string;
  result: string;
  name: string;
  tool: BuildTool;
  link: string;
  category?: string;
}

const Tooltip: FunctionalComponent<Props> = ({
  content,
  id,
  result,
  name,
  tool,
  link,
  category,
}: Props) => {
  return (
    <div
      role="tooltip"
      data-position="left" // Make this dynamic
      id={id}
      class={$tooltip}
    >
      <div class={$headerBar}>
        <div class={$headerMeta}>
          <figure class={$toolIcon}>
            <img src={toolImages[tool]} />
          </figure>
          <span>
            {category && <small>{category}</small>}
            <h2>{name}</h2>
          </span>
        </div>
        <div data-result={result} class={$toolBadge}>
          {result}
        </div>
      </div>
      <div className={$details}>
        {content && <p>{content}</p>}
        <a href={link}>Learn More</a>
      </div>
    </div>
  );
};

export default Tooltip;
