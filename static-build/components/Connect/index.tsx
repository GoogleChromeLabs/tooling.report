import { h } from 'preact';
import Lamp from '../../components/Lamp';
import { $connect, $decoration, $message, $callout } from './styles.css';

function Connect() {
  return (
    <section class={$callout}>
      <div class={$connect}>
        <div class={$decoration}>
          <Lamp />
        </div>
        <div class={$message}>
          <h2>
            Questions <span>or</span> Concerns?
          </h2>
          <p>
            We want to hear from you, let us know how to make this better. Open
            up a Github issue and we’ll track it there. Thanks!
          </p>
          <a href="https://github.com/GoogleChromeLabs/tooling.report/issues/new">
            Open a Github Issue
          </a>
        </div>
      </div>
    </section>
  );
}

export default Connect;
