import { h, FunctionalComponent, JSX, Fragment } from 'preact';
import testData from 'test-data:';
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

const parentMap = new WeakMap<Test, Test>();

const recurseTestData = (test: Test, map: WeakMap<Test, Test>) => {
  if (test.subTests) {
    for (const subtest of Object.values(test.subTests)) {
      map.set(subtest, test);
      recurseTestData(subtest, map);
    }
  }
};

for (const test of Object.values(testData)) {
  recurseTestData(test, parentMap);
}

const Crumb = (test: Test, index: number): JSX.Element => {
  const parentTest = parentMap.get(test);
  const siblingTests = parentTest?.subTests || testData;

  return (
    <Fragment>
      <span class={$divider}>//</span>
      <span class={$collection}>
        <a href="#">{test.meta.title}</a>
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
