/* eslint-disable import/first */
import '../helpers/setup';
import Axios from 'axios';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';

import { mapDispatchToProps } from '../../src/components/BlockControlContainer';
import {
  UPDATE_BLOCK_DIALECT,
  UPDATE_BLOCK_TEXT,
  MOVE_BLOCK_UP,
  MOVE_BLOCK_DOWN, Direction, BASE_URL,
} from '../../src/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const block = {
  id: 1,
  dialect: 'markdown',
  text: '# some markdown text',
};

test('move block up', () => {
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  props.handlers.moveBlock(block, Direction.UP);
  const actions = store.getActions();
  expect(actions.length).toBe(1);
  expect(_.head(actions).type).toBe(MOVE_BLOCK_UP);
});

test('move block down', () => {
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  props.handlers.moveBlock(block, Direction.DOWN);
  const actions = store.getActions();
  expect(actions.length).toBe(1);
  expect(_.head(actions).type).toBe(MOVE_BLOCK_DOWN);
});

test('update block dialect', async () => {
  const store = mockStore({
    blocks: {
      blocks: Immutable.List([block]),
    },
  });
  const props = mapDispatchToProps(store.dispatch);
  props.handlers.updateBlock(block, 'latex', block.text);
  const actions = store.getActions();
  expect(actions.length).toBe(1);
  expect(_.head(actions).type).toBe(UPDATE_BLOCK_DIALECT);
});

test('delete block', async () => {
  const mock = new MockAdapter(Axios);
  mock.onDelete(`${BASE_URL}/api/posts/1/blocks/1`).reply(
    200,
    { status: 'success' },
  );
  const store = mockStore({
    blocks: {
      blocks: Immutable.List([block]),
    },
  });
  const props = mapDispatchToProps(store.dispatch);
  await props.handlers.deleteBlock(1, 1);
  const actions = store.getActions();
  expect(actions.length).toBe(1);
});

test('update text of a block', async () => {
  const store = mockStore({
    blocks: {
      blocks: Immutable.List([block]),
    },
  });
  const props = mapDispatchToProps(store.dispatch);
  await props.handlers.updateBlock(block, 'markdown', 'new, shiny text');
  const actions = store.getActions();
  expect(actions.length).toBe(1);
  expect(_.head(actions).type).toBe(UPDATE_BLOCK_TEXT);
});
