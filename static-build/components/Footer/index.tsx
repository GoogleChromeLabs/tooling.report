import { h } from 'preact';
import Logo from '../../components/Logo';
import LinkList from '../../components/LinkList';
import Plant from '../../components/Plant';
import {
  $container,
  $footer,
  $rule,
  $desc,
  $messaging,
  $plant,
} from './styles.css';

import { html as CREDITS } from 'md:../../../CREDITS.md';

const links = [
  { title: 'Privacy Policy', href: '#' },
  { title: 'Terms and Conditions', href: '#' },
  {
    title: 'Source on Github',
    href: 'https://github.com/GoogleChromeLabs/tooling.report',
  },
];

function Footer() {
  return (
    <footer class={$footer}>
      <div class={$container}>
        <div class={$messaging}>
          <div>
            <Logo />
            <div class={$desc}>
              <span dangerouslySetInnerHTML={{ __html: CREDITS }} />
            </div>
          </div>
          <div class={$plant}>
            <Plant />
          </div>
        </div>
        <hr class={$rule} />
        <LinkList links={links} />
      </div>
    </footer>
  );
}

export default Footer;
