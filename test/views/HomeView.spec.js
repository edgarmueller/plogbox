import '../helpers/setup';
import React from 'react';
import { shallow } from 'enzyme';
import HomeView from '../../src/views/HomeView';

// test.beforeEach(async t => beforeEach(t));
//
// test.afterEach(t => afterEach(t));

test('HomeView should render', () => {
  const enzymeWrapper = shallow(
    <HomeView
      handleSubmit={() => {}}
      renderAlert={() => {}}
    />,
  );
  const h1 = enzymeWrapper.find('h1')
  expect(h1.length).toBe(1);
});
