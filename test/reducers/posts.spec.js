import test from 'ava';
import React from 'react';
import * as _ from 'lodash';

import {
    initPosts,
    selectPost,
} from '../../src/actions';
import posts, { firstPost } from '../helpers/posts';
import { postsReducer } from '../../src/reducers/posts';
import { getSelectedPost } from '../../src/reducers/index';
import { beforeEach, afterEach } from '../helpers/setup';
import { CREATE_POST_SUCCESS, DELETE_POST_SUCCESS, FETCH_BLOCKS_SUCCESS } from '../../src/constants/index';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('initialize posts sources', (t) => {
  const before = [];
  const after = postsReducer(before, initPosts(posts));
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

  const before = postsReducer({}, initPosts(posts));
  const after = postsReducer(before, {
    type: CREATE_POST_SUCCESS,
    post: newPost,
  });
  t.is(after.all.size, 2);
});

test.serial('select a post', (t) => {
  const before = postsReducer({}, initPosts(posts));
  const after = postsReducer(before, selectPost(_.head(posts)));
  t.is(_.head(posts), after.selectedPost);
});

test.serial('fetch blocks', (t) => {
  const after = postsReducer({}, {
    type: FETCH_BLOCKS_SUCCESS,
    post: firstPost,
    blocks: [{
      dialect: 'markdown',
      text: '# lowskilled',
    }],
  });
  t.is(after.blocks.size, 1);
});


test.serial('delete a post', (t) => {
  const before = postsReducer([], initPosts(posts));
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
