import { h } from 'preact';
import { $homeicon } from './styles.css';

function Home() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8.5">
      <path class={$homeicon} d="M4 8.5v-3h2v3h2.5v-4H10L5 0 0 4.5h1.5v4z" />
    </svg>
  );
}

export default Home;
