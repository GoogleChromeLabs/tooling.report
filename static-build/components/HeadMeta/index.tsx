import { h, FunctionalComponent } from 'preact';
import { imports } from 'client-bundle:client/home/index.ts';
import sharedStyles from 'css-bundle:static-build/shared/styles/index.css';
import icoURL from 'asset-url:../../img/favicon.ico';
import appleIconURL from 'asset-url:../../img/apple-touch-icon.png';
import png32URL from 'asset-url:../../img/favicon-32x32.png';
import png16URL from 'asset-url:../../img/favicon-16x16.png';
import safariURL from 'asset-url:../../img/safari-pinned-tab.svg';

interface Props {
  title: string;
  pageStyles: string;
  pageScripts: string;
}

const HeadMeta: FunctionalComponent<Props> = ({
  title,
  pageStyles,
  pageScripts,
}: Props) => {
  return (
    <head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="shortcut icon" href={icoURL} />
      <link rel="apple-touch-icon" sizes="180x180" href={appleIconURL} />
      <link rel="icon" type="image/png" sizes="32x32" href={png32URL} />
      <link rel="icon" type="image/png" sizes="16x16" href={png16URL} />
      <link rel="mask-icon" href={safariURL} />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="stylesheet" href={sharedStyles} />
      <link rel="stylesheet" href={pageStyles} />
      <script type="module" src={pageScripts} />
      {imports.map(v => (
        <link rel="preload" as="script" href={v} crossOrigin="" />
      ))}
    </head>
  );
};

export default HeadMeta;
