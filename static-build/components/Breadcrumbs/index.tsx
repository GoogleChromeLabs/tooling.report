import { h, FunctionalComponent, JSX, Fragment } from 'preact';
import testData from 'test-data:';
import { parentMap } from '../../shared/scripts/parentmap';
import { testURLMap } from '../../shared/scripts/testurl';
import { HomeIcon } from '../Icons/';
import {
  $breadcrumbs,
  $home,
  $divider,
  $collection,
  $iconbutton,
} from './styles.css';

interface Props {
  test: Test;
}

const Crumb = (test: Test, index: number): JSX.Element => {
  const parentTest = parentMap.get(test);
  const siblingTests = parentTest?.subTests || testData;

  return (
    <Fragment>
      <span class={$divider}>//</span>
      <span class={$collection}>
        <a href={testURLMap.get(test)}>{test.meta.title}</a>
        <span class={$iconbutton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="5">
            <path
              d="M4.6 2.7L9 0v2.1L4.7 5.3h-.2L0 2.1V0z"
              fill="var(--light-blue)"
            />
          </svg>
          <select data-depth={index}>
            {siblingTests &&
              Object.entries(siblingTests).map(([path, t]) =>
                t === test ? (
                  <option selected value={path + '/'}>
                    {t.meta.title}
                  </option>
                ) : (
                  <option value={path + '/'}>{t.meta.title}</option>
                ),
              )}
          </select>
        </span>
      </span>
    </Fragment>
  );
};

const Breadcrumbs: FunctionalComponent<Props> = ({ test }: Props) => {
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
      {ancestors.map(Crumb)}
    </nav>
  );
};

export default Breadcrumbs;
