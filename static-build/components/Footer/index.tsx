import { h } from 'preact';
import Logo from '../../components/Logo/index';
import {
  inline,
  $container,
  $footer,
  $rule,
  $linkList,
  $linkItem,
  $linkItself,
  $desc,
} from './styles.css';

function Footer() {
  return (
    <footer class={$footer}>
      {/* Is there a cleaner way to include the styles? */}
      <style>{inline}</style>
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
        <ul class={$linkList}>
          <li class={$linkItem}>
            <a href="#" class={$linkItself}>
              Privacy Policy
            </a>
          </li>
          <li class={$linkItem}>
            <a href="#" class={$linkItself}>
              Terms and Conditions
            </a>
          </li>
          <li class={$linkItem}>
            <a
              href="https://github.com/GoogleChromeLabs/tooling.report"
              class={$linkItself}
            >
              Source on Github
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
