import testData from 'test-data:';

export const parentMap = new WeakMap<Test, Test>();

const recurseTestData = (test: Test, map: WeakMap<Test, Test>) => {
  if (test.subTests) {
    for (const subtest of Object.values(test.subTests)) {
      map.set(subtest, test);
      recurseTestData(subtest, map);
    }
  }
};

for (const test of Object.values(testData)) {
  recurseTestData(test, parentMap);
}
