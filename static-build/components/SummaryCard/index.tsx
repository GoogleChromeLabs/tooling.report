import { h, FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { renderOnClient } from '../../libraries/isomorph';
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

  const [currentPercent, setPercent] = useState(0);

  useEffect(() => {
    if (currentPercent !== percent) {
      const dir = percent > currentPercent ? 1 : -1;
      requestAnimationFrame(() => {
        setPercent(p => p + dir);
      });
    }
  }, [currentPercent]);

  return (
    <li class={$summaryCard}>
      <figure class={$summaryCardIcon}>
        <img src={image} alt="" />
      </figure>
      <a href="#" class={$cardTitle}>
        {name}
      </a>
      <div class={$progressSummary}>
        <div class={$progressBar} style={{ width: currentPercent + '%' }}>
          <div class={$progressText}>{currentPercent}%</div>
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

export default renderOnClient(SummaryCard);
