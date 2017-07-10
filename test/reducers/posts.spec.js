import test from 'ava';
import * as _ from 'lodash';
import Immutable from 'immutable';

import {
  initPosts,
  selectPost,
  moveBlockUp,
  moveBlockDown,
} from '../../src/actions';
import posts, { firstPost } from '../helpers/posts';
import { postsReducer } from '../../src/reducers/posts';
import { getSelectedPost } from '../../src/reducers/index';
import { beforeEach, afterEach } from '../helpers/setup';
import { CREATE_POST_SUCCESS, DELETE_POST_SUCCESS, FETCH_BLOCKS_SUCCESS } from '../../src/constants/index';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('initialize posts sources', (t) => {
  const after = postsReducer(undefined, initPosts(posts));
  t.is(after.all.size, 1);
});

test.serial('create post', (t) => {
  const newPost = {
    title: 'Boring title',
        // TODO
    date: new Date().getTime(),
    isDraft: true,
    blocks: [],
  };

  const before = postsReducer(undefined, initPosts(posts));
  const after = postsReducer(before, {
    type: CREATE_POST_SUCCESS,
    post: newPost,
  });
  t.is(after.all.size, 2);
});

test.serial('select a post', (t) => {
  const before = postsReducer(undefined, initPosts(posts));
  const after = postsReducer(before, selectPost(_.head(posts)));
  t.is(_.head(posts), after.selectedPost);
});

test.serial('fetch blocks', (t) => {
  const after = postsReducer(undefined, {
    type: FETCH_BLOCKS_SUCCESS,
    post: firstPost,
    blocks: [{
      id: 0,
      dialect: 'markdown',
      text: '# lowskilled',
    }],
  });
  t.is(after.blocks.size, 1);
});


test.serial('delete a post', (t) => {
  const before = postsReducer(undefined, initPosts(posts));
  const after = postsReducer(before, {
    type: DELETE_POST_SUCCESS,
    post: firstPost,
  });
  t.is(after.all.size, 0);
});

test.serial('get post being edited', (t) => {
  t.deepEqual(firstPost, getSelectedPost({
    posts: {
      posts: {
        selectedPost: firstPost,
      },
    },
  }));
});

test.serial('move block up', (t) => {
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
  const before = postsReducer({
    all: Immutable.Set.of(firstPost),
    blocks: Immutable.List.of(
      bob,
      alice,
      john,
    ),
  }, initPosts());
  const after = postsReducer(before, moveBlockUp(alice));
  // Alice must come first
  t.is(after.blocks.first().id, 2);
  t.is(after.blocks.first().prevId, 0);
  // Bob is now at 2nd position and must point at Alice
  t.is(after.blocks.rest().first().id, 1);
  t.is(after.blocks.rest().first().prevId, 2);
  // John must point at Bob
  t.is(after.blocks.last().id, 3);
  t.is(after.blocks.last().prevId, 1);
});


test.serial('move block down', (t) => {
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
  const before = postsReducer({
    all: Immutable.Set.of(firstPost),
    blocks: Immutable.List.of(
      bob,
      alice,
      john,
    ),
  }, initPosts());
  const after = postsReducer(before, moveBlockDown(alice));
  // Alice must at last position
  t.is(after.blocks.last().id, 2);
  t.is(after.blocks.last().prevId, 3);
  // John is now at 2nd position and must point at Bob
  t.is(after.blocks.rest().first().id, 3);
  t.is(after.blocks.rest().first().prevId, 1);
});
