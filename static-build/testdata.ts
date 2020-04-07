import testData from 'test-data:';

export const parentMap = new WeakMap<Test, Test>();
export const testURLMap = new WeakMap<Test, string>();

const crawlTestData = (basePath: string, testKey: string, test: Test) => {
  testURLMap.set(test, `${basePath}/${testKey}/`);

  if (test.subTests) {
    for (const [tk, subtest] of Object.entries(test.subTests)) {
      parentMap.set(subtest, test);
      crawlTestData(`${basePath}/${testKey}`, tk, subtest);
    }
  }
};

for (const [testKey, test] of Object.entries(testData)) {
  crawlTestData('', testKey, test);
}
