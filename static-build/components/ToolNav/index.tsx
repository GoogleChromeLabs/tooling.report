import { h } from 'preact';
import { $toolNav, $tool } from './styles.css';
import config from 'consts:config';
import * as toolImages from 'shared/utils/tool-images';

function ToolNav() {
  return (
    <div className={$toolNav}>
      {config.testSubjects.map(tool => (
        <figure class={$tool}>
          <img
            height="40"
            width="40"
            src={toolImages[tool]}
            alt={`${tool} logo`}
          />
          <figcaption>{tool}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default ToolNav;
