import { h } from 'preact';
import Logo from '../../components/Logo';
import LinkList from '../../components/LinkList';
import Plant from '../../components/Plant';
import { $container, $footer, $rule, $desc, $messaging } from './styles.css';

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
            <p class={$desc}>
              Leverage agile frameworks to provide a robust synopsis for high
              level overviews. Iterative approaches to corporate strategy foster
              collaborative thinking to further the overall value proposition.
              Organically grow the holistic world view of disruptive innovation
              via workplace diversity and empowerment.
            </p>
          </div>
          <div>
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
