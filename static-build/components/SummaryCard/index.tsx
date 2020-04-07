import { h, FunctionalComponent } from 'preact';
import {
  $summaryCard,
  $summaryCardIcon,
  $cardTitle,
  $progressSummary,
  $progressBar,
  $progressText,
  $cardTestsPassedContainer,
  $cardTotal,
  $cardTotalCount,
  $dash,
} from './styles.css';

interface Props {
  name: string;
  total: number;
  possible: number;
  image: string;
}

const SummaryCard: FunctionalComponent<Props> = ({
  name,
  total,
  possible,
  image,
}: Props) => {
  const percent = Math.floor((total / possible) * 100);

  return (
    <li class={$summaryCard}>
      <figure class={$summaryCardIcon}>
        <img src={image} alt="" />
      </figure>
      <a href="#" class={$cardTitle}>
        {name}
      </a>
      <div class={$progressSummary}>
        <div class={$progressBar} style={'width:' + percent + '%'}>
          <div class={$progressText}>{percent}%</div>
        </div>
      </div>
      <div class={$cardTestsPassedContainer}>
        <div class={$cardTotal}>
          <span>{total}</span>
          <span class={$dash}>/</span>
          <span class={$cardTotalCount}>{possible}</span>
        </div>
        <a href="#">Tests Passed</a>
      </div>
    </li>
  );
};

export default SummaryCard;
