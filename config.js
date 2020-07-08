export const testSubjects = ['browserify', 'parcel', 'rollup', 'webpack'];
export const githubRepository =
  'https://github.com/GoogleChromeLabs/tooling.report/';
export const githubDefaultBranch = 'live';
export const githubContribute = `${githubRepository}blob/${githubDefaultBranch}/CONTRIBUTING.md`;

export const metaDescription =
  'A quick and easy way to figure out what the best tool for your next project is, if it’s worth your time to migrate from one tool to another and how to adopt a best practice into your existing code base. Brought to you by web.dev';

const now = new Date();
export const buildDate = [
  now.getUTCFullYear(),
  (now.getUTCMonth() + 1).toString().padStart(2, '0'),
  now
    .getUTCDate()
    .toString()
    .padStart(2, '0'),
].join('/');
