import { h, FunctionalComponent } from 'preact';
import { $linkList, $linkItem } from './styles.css';

interface Link {
  title: string;
  href: string;
}

interface Props {
  links: Link[];
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
