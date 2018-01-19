/* eslint-disable import/first */
import '../helpers/setup';
import React from 'react';
import { shallow } from 'enzyme';
import NotFoundPage from '../../src/pages/NotFoundPage';

test('NotFoundPage should render', () => {
  const wrapper = shallow(<NotFoundPage />);
  const h2 = wrapper.find('h2');
  expect(h2.text()).toBe('Sorry, the page you requested does not exist!');
});
