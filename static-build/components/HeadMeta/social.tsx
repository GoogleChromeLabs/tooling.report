import { h, Fragment } from 'preact';
import toolingReportSocial from 'asset-url:../../img/tooling-report-social.png';

export default function SocialMeta() {
  return (
    <Fragment>
      <meta property="og:type" content="article" />
      <meta property="og:image" content={toolingReportSocial} />
      <meta property="og:url" content="https://tooling.report" />
      <meta property="og:site_name" content="tooling.report" />
      <meta name="twitter:image" content={toolingReportSocial} />
      <meta name="twitter:site" content="@ChromiumDev" />
      <meta name="twitter:creator" content="@ChromiumDev" />
    </Fragment>
  );
}
