import { h, Fragment } from 'preact';
import SocialMeta from './social';
import sharedStyles from 'css-bundle:static-build/shared/styles/index.css';

import icoURL from 'asset-url:../../img/favicon.ico';
import appleIconURL from 'asset-url:../../img/apple-touch-icon.png';
import png32URL from 'asset-url:../../img/favicon-32x32.png';
import png16URL from 'asset-url:../../img/favicon-16x16.png';
import safariURL from 'asset-url:../../img/safari-pinned-tab.svg';

export default function HeadMeta() {
  return (
    <Fragment>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1"
      />
      <link rel="shortcut icon" href={icoURL} />
      <link rel="apple-touch-icon" sizes="180x180" href={appleIconURL} />
      <link rel="icon" type="image/png" sizes="32x32" href={png32URL} />
      <link rel="icon" type="image/png" sizes="16x16" href={png16URL} />
      <link rel="mask-icon" href={safariURL} />
      <meta name="color-scheme" content="dark light" />
      <SocialMeta />
      <script>{`
        const ua = navigator.userAgent;
        if (ua.includes('Windows') && ua.includes('Chrome')) {
          document.documentElement.style.setProperty('--font-weight--light', '400');
        }
      `}</script>
      <link rel="stylesheet" href={sharedStyles} />
    </Fragment>
  );
}
