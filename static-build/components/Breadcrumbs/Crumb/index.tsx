import { h, FunctionalComponent, Fragment } from 'preact';
import testData from 'test-data:';
import { testURLMap } from '../../../shared/scripts/testurl';
import { parentMap } from '../../../shared/scripts/parentmap';
import { $divider, $collection, $iconbutton } from './styles.css';

interface CrumbProps {
  test: Test;
  index: number;
  current: Test;
}

const Crumb: FunctionalComponent<CrumbProps> = ({ test, index, current }) => {
  const parentTest = parentMap.get(test);
  const siblingTests = parentTest?.subTests || testData;

  return (
    <Fragment>
      <span class={$divider}>//</span>
      <span class={$collection}>
        {test === current ? (
          <span>{test.meta.title}</span>
        ) : (
          <a href={testURLMap.get(test)}>{test.meta.title}</a>
        )}
        <span class={$iconbutton}>
          <svg viewBox="0 0 9 5">
            <path d="M4.6 2.7L9 0v2.1L4.7 5.3h-.2L0 2.1V0z" />
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

export default Crumb;
