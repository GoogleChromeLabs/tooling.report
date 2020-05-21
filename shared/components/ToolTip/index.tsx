import { h, FunctionalComponent } from 'preact';
import {
  $tooltip,
  $toolBadge,
  $headerBar,
  $headerMeta,
  $details,
  $toolIcon,
  $toolTipArrow,
} from './styles.css';
import * as toolImages from 'shared/utils/tool-images';

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
    <div role="tooltip" id={id} class={$tooltip} tabIndex={-1}>
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
      <div class={$toolTipArrow}></div>
    </div>
  );
};

export default Tooltip;
