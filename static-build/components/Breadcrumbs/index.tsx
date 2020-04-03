import { h, FunctionalComponent } from 'preact';
import testData from 'test-data:';
import { HomeIcon } from '../Icons/';
import { $breadcrumbs, $home, $divider, $collection } from './styles.css';

interface Props {
  test: Test;
}

const Breadcrumbs: FunctionalComponent<Props> = ({ test }: Props) => {
  return (
    <nav class={$breadcrumbs}>
      <a href="/" class={$home}>
        <HomeIcon />
      </a>
      <a href="/">Home</a>
      <span class={$divider}>//</span>
      <a href="#" class={$collection}>
        {test.meta.title} {test?.subTests?.length}
      </a>
      <select>
        {Object.entries(testData)
          .filter(([, t]) => t !== test)
          .map(([path, test]) => (
            <option value={path + '/'}>{test.meta.title}</option>
          ))}
      </select>
    </nav>
  );
};

export default Breadcrumbs;
