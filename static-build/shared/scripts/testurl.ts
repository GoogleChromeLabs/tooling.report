import testData from 'test-data:';

export const testURLMap = new WeakMap<Test, string>();

const recurseTestData = (basePath: string, testKey: string, test: Test) => {
  testURLMap.set(test, `${basePath}/${testKey}/`);

  if (test.subTests) {
    for (const [tk, subtest] of Object.entries(test.subTests)) {
      recurseTestData(`${basePath}/${testKey}`, tk, subtest);
    }
  }
};

for (const [testKey, test] of Object.entries(testData)) {
  recurseTestData('', testKey, test);
}
