import { h } from 'preact';
import walkerURL from 'asset-url:./walker.svg';

function Hero() {
  return (
    <img
      width="188"
      height="377"
      alt="Person in shorts with blue hair walking left"
      src={walkerURL}
    />
  );
}

export default Hero;
