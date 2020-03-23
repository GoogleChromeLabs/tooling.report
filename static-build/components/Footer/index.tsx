import { h } from 'preact';
import Logo from '../../components/Logo/index';
import LinkList from '../../components/LinkList/index';
import { $container, $footer, $rule, $desc } from './styles.css';

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
        <Logo />
        <p class={$desc}>
          Leverage agile frameworks to provide a robust synopsis for high level
          overviews. Iterative approaches to corporate strategy foster
          collaborative thinking to further the overall value proposition.
          Organically grow the holistic world view of disruptive innovation via
          workplace diversity and empowerment.
        </p>
        <hr class={$rule} />
        <LinkList links={links} />
      </div>
    </footer>
  );
}

export default Footer;
