import { h } from 'preact';
import Lamp from '../../components/Lamp';
import LinkList from '../../components/LinkList';
import { $connect, $decoration, $message } from './styles.css';

function Connect() {
  return (
    <section class={$connect}>
      <div class={$decoration}>
        <Lamp />
      </div>
      <div class={$message}>
        <h2>
          Questions <span>or</span> Concerns?
        </h2>
        <p>
          We want to hear from you, let us know how to make this better. Open up
          a Github issue and we’ll track it there. Thanks!
        </p>
        <LinkList links={[{ title: 'Open a Github Issue', href: '#' }]} />
      </div>
    </section>
  );
}

export default Connect;
