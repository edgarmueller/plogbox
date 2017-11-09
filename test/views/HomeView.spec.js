import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import { afterEach, beforeEach } from '../helpers/setup';
import HomeView from '../../src/views/HomeView';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test('HomeView should render', (t) => {
  const enzymeWrapper = shallow(
    <HomeView
      handleSubmit={() => {}}
      renderAlert={() => {}}
    />,
  );
  const h1 = enzymeWrapper.find('h1')
  t.is(h1.length, 1);
});
