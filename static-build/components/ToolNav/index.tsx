import { h } from 'preact';
import { $toolNav, $tool } from './styles.css';
import config from 'consts:config';
import gulp from 'asset-url:../../img/gulp.svg';
import rollup from 'asset-url:../../img/rollup.svg';
import webpack from 'asset-url:../../img/webpack.svg';
import parcel from 'asset-url:../../img/parcel.svg';
const toolImages = { gulp, rollup, webpack, parcel };

function ToolNav() {
  return (
    <div className={$toolNav}>
      {config.testSubjects.map(tool => (
        <figure class={$tool}>
          <img src={toolImages[tool]} />
          <figcaption>{tool}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default ToolNav;
