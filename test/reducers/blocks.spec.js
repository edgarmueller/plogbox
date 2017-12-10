import test from 'ava';
import Immutable from 'immutable';

import { moveBlockDown, moveBlockUp } from '../../src/actions';
import { firstPost } from '../helpers/posts';
import { blocksReducer } from '../../src/reducers/blocks';
import { afterEach, beforeEach } from '../helpers/setup';
import { FETCH_BLOCKS_SUCCESS } from '../../src/constants/index';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('fetch blocks', (t) => {
  const after = blocksReducer(undefined, {
    type: FETCH_BLOCKS_SUCCESS,
    post: firstPost,
    blocks: [{
      id: 0,
      dialect: 'markdown',
      text: '# lowskilled',
    }],
  });
  t.is(after.size, 1);
});


test('move block up', (t) => {
  const bob = {
    id: 1,
    index: 0,
    dialect: 'markdown',
    text: 'Bob',
  };
  const alice = {
    id: 2,
    index: 1,
    dialect: 'markdown',
    text: 'Alice',
  };
  const john = {
    id: 3,
    index: 2,
    dialect: 'latex',
    text: 'John',
  };
  const before = blocksReducer(
    Immutable.List.of(
      bob,
      alice,
      john,
    ), {
      type: FETCH_BLOCKS_SUCCESS,
      blocks: [bob, alice, john],
    });

  const after = blocksReducer(before, moveBlockUp(alice));
  // Alice must come first
  t.is(after.first().id, 2);
  // Bob is now at 2nd position and must point at Alice
  t.is(after.rest().first().id, 1);
  // John must point at Bob
  t.is(after.last().id, 3);
});


test('move block down', (t) => {
  const bob = {
    id: 1,
    prevId: 0, // first post in order
    dialect: 'markdown',
    text: 'Bob',
  };
  const alice = {
    id: 2,
    prevId: 1,
    dialect: 'markdown',
    text: 'Alice',
  };
  const john = {
    id: 3,
    prevId: 2,
    dialect: 'latex',
    text: 'John',
  };

  const before = blocksReducer(
    Immutable.List.of(
      bob,
      alice,
      john,
    ), {
      type: FETCH_BLOCKS_SUCCESS,
      blocks: [bob, alice, john],
    });

  const after = blocksReducer(before, moveBlockDown(alice));
  // Alice must at last position
  t.is(after.last().id, 2);
  // John is now at 2nd position and must point at Bob
  t.is(after.rest().first().id, 3);
});
