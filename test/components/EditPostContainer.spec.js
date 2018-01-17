/* eslint-disable import/first */
import '../helpers/setup';
import React from 'react';
import { EditPostContainer } from '../../src/components/EditPostContainer';
import { firstPost } from '../helpers/posts';
import { shallow } from 'enzyme';


test('update title of a post', async () => {
  const wrapper = shallow(<EditPostContainer />);
  wrapper.instance().handleUpdatePost(firstPost);
  expect(wrapper.state().post.id).toBe(0);
});

