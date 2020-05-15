import { h, FunctionalComponent, Fragment } from 'preact';
import { $divider, $collection, $iconbutton } from './styles.css';

export interface CrumbOption {
  title: string;
  path?: string;
}

export interface Crumb {
  selected: number;
  options: CrumbOption[];
}

interface Props {
  crumb: Crumb;
  isLast: boolean;
}

const Crumb: FunctionalComponent<Props> = ({ crumb, isLast }) => {
  const selectedCrumb = crumb.options[crumb.selected];

  return (
    <Fragment>
      <span class={$divider}>//</span>
      <span class={$collection}>
        {isLast || !selectedCrumb.path ? (
          <span>{selectedCrumb.title}</span>
        ) : (
          <a href={selectedCrumb.path}>{selectedCrumb.title}</a>
        )}
        {crumb.options.length > 1 && (
          <span class={$iconbutton}>
            <span>
              <svg viewBox="0 0 9 5">
                <path d="M4.6 2.7L9 0v2.1L4.7 5.3h-.2L0 2.1V0z" />
              </svg>
            </span>
            <select>
              {crumb.options.map(crumbOption => (
                <option
                  selected={crumbOption === selectedCrumb}
                  value={crumbOption.path}
                >
                  {crumbOption.title}
                </option>
              ))}
            </select>
          </span>
        )}
      </span>
    </Fragment>
  );
};

export default Crumb;
