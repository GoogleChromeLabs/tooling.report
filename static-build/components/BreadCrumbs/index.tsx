import { h, FunctionalComponent, Fragment } from 'preact';
import { $breadcrumbs, $home } from './styles.css';
import Crumb, { Crumb as CrumbInterface } from './Crumb';
import { $collection, $iconbutton } from './Crumb/styles.css';

interface Props {
  crumbs: CrumbInterface[];
}

const BreadCrumbs: FunctionalComponent<Props> = ({ crumbs }) => {
  return (
    <Fragment>
      <nav class={$breadcrumbs} id="breadcrumbs">
        <a href="/" class={`${$home} ${$collection}`}>
          <span class={$iconbutton}>
            <span>
              <svg viewBox="0 0 10 10">
                <path d="M4 8.5v-3h2v3h2.5v-4H10L5 0 0 4.5h1.5v4z" />
              </svg>
            </span>
          </span>
          <span>Home</span>
        </a>
        {crumbs.map((crumb, index) => (
          <Crumb crumb={crumb} isLast={index === crumbs.length - 1} />
        ))}
      </nav>
      <script
        dangerouslySetInnerHTML={{
          __html:
            'document.currentScript.previousElementSibling.scrollLeft = Number.MAX_SAFE_INTEGER;',
        }}
      />
    </Fragment>
  );
};

export default BreadCrumbs;
