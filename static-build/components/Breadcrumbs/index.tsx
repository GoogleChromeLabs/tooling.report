import { h, FunctionalComponent } from 'preact';
import testData from 'test-data:';
import { HomeIcon } from '../Icons/';
import {
  $breadcrumbs,
  $home,
  $divider,
  $collection,
  $dropdown,
} from './styles.css';

interface Props {
  test: Test;
}

const Breadcrumbs: FunctionalComponent<Props> = ({ test }: Props) => {
  return (
    <nav class={$breadcrumbs} id="breadcrumbs">
      <a href="/" class={$home}>
        <HomeIcon />
      </a>
      <a href="/">Home</a>
      <span class={$divider}>//</span>
      <a class={$collection}>
        {test.meta.title} {test?.subTests?.length}
        <span class={$dropdown}>
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="5">
            <path
              d="M4.6 2.7L9 0v2.1L4.7 5.3h-.2L0 2.1V0z"
              fill="var(--light-blue)"
            />
          </svg>
          <select>
            {Object.entries(testData).map(([path, t]) =>
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
      </a>
    </nav>
  );
};

export default Breadcrumbs;
