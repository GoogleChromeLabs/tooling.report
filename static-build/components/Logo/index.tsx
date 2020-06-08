import { h } from 'preact';
import { ReportIcon } from '../Icons/';
import { $logo, $report, $linkwrap } from './styles.css';

function Logo() {
  return (
    <a href="/" title="Home" class={$linkwrap}>
      <h2 class={$logo}>
        <ReportIcon />
        tooling.<span class={$report}>report</span>
      </h2>
    </a>
  );
}

export default Logo;
