import { h, FunctionalComponent } from 'preact';
import {
  $testCard,
  $cardTitle,
  $cardTestsPassedContainer,
  $cardTotal,
  $cardTotalCount,
  $dash,
  $testCardDesc,
} from './styles.css';

interface Props {
  name: string;
  total: number;
  possible: number;
  link: string;
}

const TestCard: FunctionalComponent<Props> = ({
  name,
  total,
  possible,
  link,
}: Props) => {
  return (
    <li class={$testCard}>
      <a href={link} class={$cardTitle}>
        {name}
      </a>
      <div class={$cardTestsPassedContainer}>
        <div class={$cardTotal}>
          <span>{total}</span>
          <span class={$dash}>/</span>
          <span class={$cardTotalCount}>{possible}</span>
        </div>
        <p class={$testCardDesc}>Bundlers Passing</p>
      </div>
    </li>
  );
};

export default TestCard;
