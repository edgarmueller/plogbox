import test from 'ava';
import React from 'react';
import { Provider } from 'react-redux';
import * as Immutable from 'immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { afterEach, beforeEach, mountWithContext, setupDom } from '../helpers/setup';
import {BlockEditor} from "../../src/components/BlockEditor";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test.beforeEach(async (t) => {
  beforeEach(t);
  t.context.block = {
    id: 1,
    dialect: 'markdown',
    text: '# some markdown text',
  };
});

test.afterEach(t => afterEach(t));

test.cb('should render Editor', (t) => {
  const store = mockStore({
    blocks: {
      blocks: Immutable.List(),
    },
  });
  const block = {
    dialect: 'markdown',
    text: 'Some example text',
  };
  setupDom(() => {
    /* eslint-disable */
    const AceEditor = require('react-ace').default;
    /* eslint-enable */

    const enzymeWrapper = mountWithContext(
      t,
      <BlockEditor
        postId={0}
        block={block}
        onDrop={() => {}}
        updateText={() => {}}
      />
    );

    const editor = enzymeWrapper.find(AceEditor);
    t.is(editor.length, 1);
    t.end();
  });
});
