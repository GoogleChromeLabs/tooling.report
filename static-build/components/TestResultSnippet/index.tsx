import { h, FunctionalComponent } from 'preact';
import { $resultItem, $toolIcon, $toolName, $toolBadge } from './styles.css';

interface Props {
  name: string;
  result: string;
  image: string;
  details: string;
  link: string;
}

const TestResultSnippet: FunctionalComponent<Props> = ({
  name,
  result,
  image,
  details,
  link,
}: Props) => {
  return (
    <li class={$resultItem}>
      <a href="#" class={$toolName}>
        {name}
      </a>
      <figure class={$toolIcon}>
        <img src={image} alt="" />
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
