import { h } from 'preact';
import { GithubIcon } from '../Icons/';
import config from 'consts:config';
import { $fab, $fabicon } from './styles.css';

function Logo() {
  return (
    <a class={$fab} href={config.githubRepository} title="Source on GitHub">
      <span class={$fabicon}>
        <GithubIcon />
      </span>
    </a>
  );
}

export default Logo;
