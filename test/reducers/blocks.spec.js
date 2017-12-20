/* eslint-disable import/first */
import '../helpers/setup';
import Immutable from 'immutable';

import { moveBlockDown, moveBlockUp } from '../../src/actions';
import { firstPost } from '../helpers/posts';
import { blocksReducer } from '../../src/reducers/blocks';

import { FETCH_BLOCKS_SUCCESS } from '../../src/constants/index';

test('fetch blocks', () => {
  const after = blocksReducer(undefined, {
    type: FETCH_BLOCKS_SUCCESS,
    post: firstPost,
    blocks: [{
      id: 0,
      dialect: 'markdown',
      text: '# lowskilled',
    }],
  });
  expect(after.size).toBe(1);
});


test('move block up', () => {
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
  expect(after.first().id).toBe(2);
  // Bob is now at 2nd position and must point at Alice
  expect(after.rest().first().id).toBe(1);
  // John must point at Bob
  expect(after.last().id).toBe(3);
});


test('move block down', () => {
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
  expect(after.last().id).toBe(2);
  // John is now at 2nd position and must point at Bob
  expect(after.rest().first().id).toBe(3);
});
