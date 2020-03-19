import { h } from 'preact';
import { $logo, $report } from './styles.css';

function Logo() {
  return (
    <h2 class={$logo}>
      Tooling.<span class={$report}>Report</span>
    </h2>
  );
}

export default Logo;
