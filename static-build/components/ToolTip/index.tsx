import { h, FunctionalComponent } from 'preact';
import { $tooltip } from './styles.css';

interface Props {
  content: string;
  id: string;
}

const Tooltip: FunctionalComponent<Props> = ({ content, id }: Props) => {
  return (
    <div
      role="tooltip"
      data-position="left" // Make this dynamic
      id={id}
      class={$tooltip}
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
};

export default Tooltip;
