import { h } from 'preact';
import { ReportIcon } from '../Icons/';
import { $logo, $report } from './styles.css';

function Logo() {
  return (
    <h2 class={$logo}>
      <ReportIcon />
      Tooling.<span class={$report}>Report</span>
    </h2>
  );
}

export default Logo;
