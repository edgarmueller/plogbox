/* eslint-disable import/first */
import '../helpers/setup';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import { shallow } from 'enzyme';
import { EditPostPage } from '../../src/pages/EditPostPage';

test('should show error', () => {
  const wrapper = shallow(<EditPostPage />);
  wrapper.setState({ error: 'An wild error occurred!' });
  expect(wrapper.find(Dialog)).toHaveLength(1);
});
