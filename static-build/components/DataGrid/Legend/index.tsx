import { h } from 'preact';
import { $legendCard, $legendRow, $legendHeader } from './styles.css';
import { $dot } from '../styles.css';

function Legend() {
  return (
    <div>
      <h4 class={$legendHeader}>Legend</h4>
      <div class={$legendCard}>
        <div class={$legendRow}>
          <span data-result="pass" class={$dot}></span> Pass
        </div>
        <div class={$legendRow}>
          <span data-result="partial" class={$dot}></span> Partial Pass
        </div>
        <div class={$legendRow}>
          <span data-result="fail" class={$dot}></span> Fail
        </div>
        <div class={$legendRow}>
          <span data-result="skip" class={$dot}></span> Skip / Doesn't Apply
        </div>
      </div>
    </div>
  );
}

export default Legend;
