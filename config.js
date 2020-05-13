export const testSubjects = ['rollup', 'webpack', 'parcel', 'gulp'];
export const githubRepository =
  'https://github.com/GoogleChromeLabs/tooling.report/';

const build = new Date();
export const buildDate = `${build.getDate()}/${build.getMonth() +
  1}/${build.getFullYear()}`;
