import React from 'react';
import PostList from './PostList';
import ListItem from '@material-ui/core/ListItem';
import Enzyme, { shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

it('should render posts', () => {
  const posts = [
    { name: 'foo' },
    { name: 'bar' }
  ]
  const wrapper = shallow(
    <PostList
      tag='test'npm
      posts={posts}
      addPost={jest.fn()}
      classes={{}}
      selectPost={jest.fn()}
    />
  );
  expect(wrapper.dive().find(ListItem).length).toBe(2);
});
