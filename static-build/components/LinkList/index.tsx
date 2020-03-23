import { h, FunctionalComponent } from 'preact';
import { $linkList, $linkItem } from './styles.css';

interface Props {
  links: Link[];
  // todo: insert-spacer: Boolean;
}

const LinkList: FunctionalComponent<Props> = ({ links }: Props) => {
  return (
    <ul class={$linkList}>
      {links.map((l: Link) => (
        <li class={$linkItem}>
          <a href={l.href}>{l.title}</a>
        </li>
      ))}
    </ul>
  );
};

export default LinkList;
