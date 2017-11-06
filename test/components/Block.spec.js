import test from 'ava';
import React from 'react';
import * as Immutable from 'immutable';
import Latex from 'react-latex';
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

test('Block should render markdown', (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const block = {
    id: 0,
    dialect: 'markdown',
    text: 'Some markdown text',
  };

  const enzymeWrapper = mountWithContext(
    t,
    <Provider store={store}>
      <Block
        postId={firstPost.id}
        block={block}
      />
    </Provider>,
  );
  const reactMd = enzymeWrapper.find(ReactMarkdown);
  t.is(reactMd.length, 1);
});


test('BlockContainer should render image', (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const block = {
    id: 0,
    dialect: 'image',
    name: 'dog.npg',
    text: 'binary image data would go here',
  };

  const enzymeWrapper = mountWithContext(
    t,
    <Provider store={store}>
      <Block
        postId={firstPost.id}
        block={block}
      />
    </Provider>,
  );
  const img = enzymeWrapper.find('img');
  t.is(img.length, 1);
});

test('BlockContainer should render latex', (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const block = {
    id: 0,
    dialect: 'latex',
    text: '$1 + 1 = 2$',
  };

  const enzymeWrapper = mountWithContext(
    t,
    <Provider store={store}>
      <Block
        postId={firstPost.id}
        block={block}
      />
    </Provider>,
  );
  const img = enzymeWrapper.find(Latex);
  t.is(img.length, 1);
});

