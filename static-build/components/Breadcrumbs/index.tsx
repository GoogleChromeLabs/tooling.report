import { h, FunctionalComponent } from 'preact';
import { parentMap } from '../../testdata';
import { $breadcrumbs, $home } from './styles.css';
import Crumb from './Crumb';
import { $collection, $iconbutton } from './Crumb/styles.css';

interface BreadcrumbProps {
  test: Test;
}

const Breadcrumbs: FunctionalComponent<BreadcrumbProps> = ({ test }) => {
  const ancestors = [test];
  let ancestor = parentMap.get(test);

  while (ancestor) {
    ancestors.unshift(ancestor);
    ancestor = parentMap.get(ancestor);
  }

  return (
    <nav class={$breadcrumbs} id="breadcrumbs">
      <a href="/" class={`${$home} ${$collection}`}>
        <span class={$iconbutton}>
          <svg viewBox="0 0 10 10">
            <path d="M4 8.5v-3h2v3h2.5v-4H10L5 0 0 4.5h1.5v4z" />
          </svg>
        </span>
        <span>Home</span>
      </a>
      {ancestors.map((ancestor, index) => (
        <Crumb test={ancestor} index={index} current={test} />
      ))}
    </nav>
  );
};

export default Breadcrumbs;
