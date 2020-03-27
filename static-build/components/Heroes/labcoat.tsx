import { h } from 'preact';
import labcoatURL from 'asset-url:./labcoat.svg';

function Hero() {
  return (
    <img
      width="244"
      height="397"
      alt="Person in labcoat walking left"
      src={labcoatURL}
    />
  );
}

export default Hero;
