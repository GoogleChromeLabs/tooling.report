import { h } from 'preact';
import { ReportIcon } from '../Icons/';
import { $logo, $report } from './styles.css';

function Logo() {
  return (
    <h2 class={$logo}>
      <ReportIcon />
      tooling.<span class={$report}>report</span>
    </h2>
  );
}

export default Logo;
