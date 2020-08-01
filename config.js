export const testSubjects = ['browserify', 'parcel', 'rollup', 'webpack'];
export const githubRepository =
  'https://github.com/GoogleChromeLabs/tooling.report/';
export const githubDefaultBranch = 'live';
export const githubContribute = `${githubRepository}blob/${githubDefaultBranch}/CONTRIBUTING.md`;
export const origin = 'https://bundlers.tooling.report';

const now = new Date();
export const buildDate = [
  now.getUTCFullYear(),
  (now.getUTCMonth() + 1).toString().padStart(2, '0'),
  now
    .getUTCDate()
    .toString()
    .padStart(2, '0'),
].join('/');
