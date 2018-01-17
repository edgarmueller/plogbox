/* eslint-disable import/first */
import '../helpers/setup';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import { shallow } from 'enzyme';
import { EditPostView } from '../../src/views/EditPostView';

test('should show error', () => {
  const wrapper = shallow(<EditPostView />);
  wrapper.setState({ error: 'An wild error occurred!' });
  expect(wrapper.find(Dialog)).toHaveLength(1);
});
