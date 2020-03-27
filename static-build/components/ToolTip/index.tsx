import { h, FunctionalComponent } from 'preact';
import { $tooltip } from './styles.css';

interface Props {
  content: string;
}

const Tooltip: FunctionalComponent<Props> = ({ content }: Props) => {
  return (
    <div class={$tooltip} dangerouslySetInnerHTML={{ __html: content }}></div>
  );
};

export default Tooltip;
