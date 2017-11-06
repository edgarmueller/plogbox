import test from 'ava';
import React from 'react';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactMarkdown from 'react-markdown';
import { Provider } from 'react-redux';
import Block from '../../src/components/BlockContainer';
import { firstPost, posts } from '../helpers/posts';
import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test('BlockContainer should render', (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });

  const enzymeWrapper = mountWithContext(
    t,
    <Provider store={store}>
      <Block
        postId={firstPost.id}
        block={_.head(firstPost.blocks)}
      />
    </Provider>,
  );
  const reactMd = enzymeWrapper.find(ReactMarkdown);
  t.is(reactMd.length, 1);
});
