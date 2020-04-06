import { h, FunctionalComponent } from 'preact';
import { parentMap } from '../../shared/scripts/parentmap';
import { HomeIcon } from '../Icons/';
import { $breadcrumbs, $home } from './styles.css';
import Crumb from './Crumb';
import { $collection, $iconbutton } from './Crumb/styles.css';

interface BreadcrumbProps {
  test: Test;
}

const Breadcrumbs: FunctionalComponent<BreadcrumbProps> = ({ test }) => {
  const ancestors = new Array<Test>(test);
  let ancestor = parentMap.get(test);

  while (ancestor) {
    ancestors.unshift(ancestor);
    ancestor = parentMap.get(ancestor);
  }

  return (
    <nav class={$breadcrumbs} id="breadcrumbs">
      <a href="/" class={`${$home} ${$collection}`}>
        <span class={$iconbutton}>
          <HomeIcon />
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
