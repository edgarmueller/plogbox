import test from 'ava';
import * as _ from 'lodash';

import { initPosts, selectPost } from '../../src/actions';
import { posts, firstPost } from '../helpers/posts';
import { postsReducer } from '../../src/reducers/posts';
import { getSelectedPost } from '../../src/reducers';
import { afterEach, beforeEach } from '../helpers/setup';
import { CREATE_POST_SUCCESS, DELETE_POST_SUCCESS } from '../../src/constants';

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
