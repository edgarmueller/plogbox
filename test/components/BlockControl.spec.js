import test from 'ava';
import React from 'react';
import Axios from 'axios';
import { Provider } from 'react-redux';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  ConnectBlockControlContainer,
  mapDispatchToProps,
} from '../../src/components/BlockControlContainer';
import { afterEach, beforeEach, mountWithContext, setupDom } from '../helpers/setup';
import {
  UPDATE_BLOCK_DIALECT,
  UPDATE_BLOCK_TEXT,
  MOVE_BLOCK_UP,
  MOVE_BLOCK_DOWN,
} from '../../src/constants';

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

test('moveBlockUp', (t) => {
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  props.moveBlockUp(t.context.block);
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(MOVE_BLOCK_UP, _.head(actions).type);
});

test('moveBlockDown', (t) => {
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  props.moveBlockDown(t.context.block);
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(MOVE_BLOCK_DOWN, _.head(actions).type);
});

test('updateBlockDialect', async (t) => {
  const block = {
    id: 1,
    dialect: 'markdown',
    text: '# some markdown text',
  };
  const store = mockStore({
    blocks: {
      blocks: Immutable.List([block]),
    },
  });
  const props = mapDispatchToProps(store.dispatch);
  props.updateBlockDialect(block, 'latex');
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(UPDATE_BLOCK_DIALECT, _.head(actions).type);
});

test('removeBlock', async (t) => {
  const b = {
    id: 1,
    dialect: 'markdown',
    text: '# some markdown text',
  };
  const resolved = new Promise(r => r({
    data: {
      data: b,
    },
  }));
  t.context.sandbox.stub(Axios, 'delete').returns(resolved);
  const store = mockStore({
    blocks: {
      blocks: Immutable.List([b]),
    },
  });
  const props = mapDispatchToProps(store.dispatch);
  await props.removeBlock(1, 1);
  const actions = store.getActions();
  t.is(actions.length, 1);
});

test('update text of a block', async (t) => {
  const b = {
    id: 1,
    dialect: 'markdown',
    text: '# some markdown text',
  };
  const store = mockStore({
    blocks: {
      blocks: Immutable.List([b]),
    },
  });
  const props = mapDispatchToProps(store.dispatch);
  props.updateBlockText(b, 'new, shiny text');
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(UPDATE_BLOCK_TEXT, _.head(actions).type);
});

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
      <Provider store={store}>
        <ConnectBlockControlContainer
          postId={0}
          block={block}
          isLastBlock
          isFirstBlock
        />
      </Provider>,
    );

    const editor = enzymeWrapper.find(AceEditor);
    t.is(editor.length, 1);
    t.end();
  });
});
