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
  link: string;
  results: object;
}

const TestCard: FunctionalComponent<Props> = ({
  name,
  link,
  results,
}: Props) => {
  const totalPassing = () => {
    let total = 0;
    Object.entries(results).forEach(tool => {
      if (tool[1].meta.result === 'pass') {
        total += 1;
      } else if (tool[1].meta.result === 'partial') {
        total += 0.5;
      }
    });
    return total;
  };

  const totalTested = () => {
    return Object.entries(results).length;
  };

  // Testing if this isn't another subtest that links through (i.e. code-splitting/splitting-modules)
  const renderPassing = () => {
    if (totalTested() > 0) {
      return (
        <div class={$cardTestsPassedContainer}>
          <div class={$cardTotal}>
            <span>{totalPassing()}</span>
            <span class={$dash}>/</span>
            <span class={$cardTotalCount}>{totalTested()}</span>
          </div>
          <p class={$testCardDesc}>Bundlers Passing</p>
        </div>
      );
    }
  };

  return (
    <li class={$testCard}>
      <a href={link} class={$cardTitle}>
        {name}
      </a>
      {renderPassing()}
    </li>
  );
};

export default TestCard;
