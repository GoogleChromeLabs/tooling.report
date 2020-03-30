import { h, FunctionalComponent } from 'preact';
import {
  $testCard,
  $cardTitle,
  $cardTotal,
  $cardTotalCount,
  $dash,
  $subText,
  $testDesc,
} from './styles.css';

interface Props {
  name: string;
  link: string;
  results: object;
  desc: string;
}

const TestCard: FunctionalComponent<Props> = ({
  name,
  link,
  results,
  desc,
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
        <div>
          <div class={$cardTotal}>
            <span>{totalPassing()}</span>
            <span class={$dash}>/</span>
            <span class={$cardTotalCount}>{totalTested()}</span>
          </div>
          <p class={$subText}>Bundlers Passing</p>
        </div>
      );
    } else {
      return (
        <div>
          <div class={$cardTotal}>
            <span class={$cardTotalCount}>X</span>
          </div>
          <p class={$subText}>Sub Tests</p>
        </div>
      );
    }
  };

  return (
    <li class={$testCard}>
      <div>
        <a href={link} class={$cardTitle}>
          {name}
        </a>
        <p class={$testDesc}>{desc}</p>
      </div>
      {renderPassing()}
    </li>
  );
};

export default TestCard;
