/* eslint-disable import/first */
import '../helpers/setup';
import * as _ from 'lodash';
import { moveBlockUp, moveBlockDown } from '../../src/utils/blocks';

test('move block up', () => {
  // arrange
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

  // act
  const after = moveBlockUp([bob, alice, john], alice);

  // assert
  // Alice must come first
  expect(_.head(after).id).toBe(2);
  // John must point at Bob
  expect(_.last(after).id).toBe(3);
});

test('move block down', () => {
  // arrange
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

  // act
  const after = moveBlockDown([bob, alice, john], bob);

  // assert
  // Alice must come first
  expect(_.head(after).id).toBe(2);
  // Bob stays at last pos
  expect(_.last(after).id).toBe(3);
});
