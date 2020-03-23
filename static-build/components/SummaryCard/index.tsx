import { h, FunctionalComponent } from 'preact';
import {
  $summaryCard,
  $summaryCardIcon,
  $cardTitle,
  $summaryProgress,
  $cardTestsPassedContainer,
  $cardTotal,
  $cardTotalCount,
  $dash,
} from './styles.css';

interface Props {
  name: String;
  total: Number;
  possible: Number;
}

const SummaryCard: FunctionalComponent<Props> = ({
  name,
  total,
  possible,
}: Props) => {
  const percent = 50; //total / possible;

  return (
    <li class={$summaryCard}>
      <figure class={$summaryCardIcon}>
        <img
          src="https://raw.githubusercontent.com/webpack/media/master/logo/icon.png"
          alt=""
        />
      </figure>
      <a href="#" class={$cardTitle}>
        {name}
      </a>
      <progress class={$summaryProgress} value={percent} max="100">
        {percent}
      </progress>
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
