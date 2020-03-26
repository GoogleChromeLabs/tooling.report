import { h } from 'preact';
import plantURL from 'asset-url:./plant.svg';

function Plant() {
  return (
    <img
      width="128"
      height="267"
      alt="Plant with tall leafs and vines in a pot"
      src={plantURL}
    />
  );
}

export default Plant;
