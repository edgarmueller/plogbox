/* eslint-disable import/first */
import '../helpers/setup';
import * as _ from 'lodash';
import { initPosts, selectPost } from '../../src/actions';
import { posts, firstPost } from '../helpers/posts';
import { postsReducer } from '../../src/reducers/posts';
import { getSelectedPost } from '../../src/reducers';
import { CREATE_POST_SUCCESS, DELETE_POST_SUCCESS } from '../../src/constants';

test('initialize posts sources', () => {
  const after = postsReducer(undefined, initPosts(posts));
  expect(after.all.size).toBe(1);
});

test('create post', () => {
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
  expect(after.all.size).toBe(2);
});

test('select a post', () => {
  const before = postsReducer(undefined, initPosts(posts));
  const after = postsReducer(before, selectPost(_.head(posts)));
  expect(after.selectedPost).toEqual(_.head(posts));
});

test('delete a post', () => {
  const before = postsReducer(undefined, initPosts(posts));
  const after = postsReducer(before, {
    type: DELETE_POST_SUCCESS,
    post: firstPost,
  });
  expect(after.all.size).toBe(0);
});

test('get post being edited', () => {
  expect(getSelectedPost({
    posts: {
      posts: {
        selectedPost: firstPost,
      },
    },
  })).toEqual(firstPost);
});
