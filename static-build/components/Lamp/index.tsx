import { h } from 'preact';
import lampURL from 'asset-url:./lamp.svg';

function Lamp() {
  return (
    <img
      width="90"
      height="214"
      alt="Plant with tall leafs and vines in a pot"
      src={lampURL}
    />
  );
}

export default Lamp;
