/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { MemoryRouter, Switch } from 'react-router';
import configureMockStore from 'redux-mock-store';
import { Grid } from 'material-ui'

import { App } from '../../src/components/App';
import { Editor } from '../../src/components/Editor';
import { firstPost } from '../helpers/posts';
import { RenderedBlock } from '../../src/components/RenderedBlock';
import withDragDropContext from '../../src/common/withDragDropContext';

const mockStore = configureMockStore();

test('Render Editor', () => {
    console.log('first post ', firstPost)
     const Component = Editor;
    const wrapper = shallow(
        <Component post={firstPost} />
    );
    expect(wrapper.find(Grid).length).toBe(4);
});