import { h, FunctionalComponent } from 'preact';
import { parentMap, testURLMap } from 'static-build/testdata';
import testData from 'test-data:';
import { Crumb } from '../BreadCrumbs/Crumb';
import BreadCrumbs from '../BreadCrumbs';

interface Props {
  test: Test;
}

const TestCrumbs: FunctionalComponent<Props> = ({ test }) => {
  const ancestors = [test];
  let ancestor = parentMap.get(test);

  while (ancestor) {
    ancestors.unshift(ancestor);
    ancestor = parentMap.get(ancestor);
  }

  const crumbs: Crumb[] = ancestors.map(test => {
    const parentTest = parentMap.get(test);
    const siblingTests = Object.values(parentTest?.subTests || testData);
    const options: Crumb['options'] = siblingTests.map(test => ({
      title: test.meta.title,
      path: testURLMap.get(test),
    }));

    return { options, selected: siblingTests.indexOf(test) };
  });

  return <BreadCrumbs crumbs={crumbs} />;
};

export default TestCrumbs;
