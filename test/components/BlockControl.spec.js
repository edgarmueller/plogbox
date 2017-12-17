import test from 'ava';
import Axios from 'axios';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  BlockControlContainer,
  mapDispatchToProps,
} from '../../src/components/BlockControlContainer';
import { afterEach, beforeEach } from '../helpers/setup';
import {
  UPDATE_BLOCK_DIALECT,
  UPDATE_BLOCK_TEXT,
  MOVE_BLOCK_UP,
  MOVE_BLOCK_DOWN, Direction,
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

test('move block up', (t) => {
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  props.handlers.moveBlock(t.context.block, Direction.UP);
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(MOVE_BLOCK_UP, _.head(actions).type);
});

test('move block down', (t) => {
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  props.handlers.moveBlock(t.context.block, Direction.DOWN);
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(MOVE_BLOCK_DOWN, _.head(actions).type);
});

test('update block dialect', async (t) => {
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
  props.handlers.updateBlock(block, 'latex', block.text);
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(UPDATE_BLOCK_DIALECT, _.head(actions).type);
});

test('delete block', async (t) => {
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
  await props.handlers.deleteBlock(1, 1);
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
  props.handlers.updateBlock(b, 'markdown', 'new, shiny text');
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(UPDATE_BLOCK_TEXT, _.head(actions).type);
});
