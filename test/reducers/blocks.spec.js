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
