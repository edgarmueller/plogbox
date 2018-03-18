/* eslint-disable import/first */
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Grid } from 'material-ui';
import { firstPost } from '../helpers/posts';
import { Editor } from '../../src/components/Editor';

Enzyme.configure({ adapter: new Adapter() });

test('Render Editor', () => {
  const wrapper = shallow(
    <Editor 
      post={firstPost} 
      handleSetBlocks={() => {}}
      handleAddBlock={() => {}}
      classes={{
        whiteBackground: 'whiteBackground',
      }}
    />
  );
  expect(wrapper.find(Grid).length).toBe(3);
});
