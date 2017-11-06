import test from 'ava';
import React from 'react';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { AutoComplete } from 'material-ui';
import Tag, { mapDispatchToProps } from '../../src/components/TagContainer';
import { posts } from '../helpers/posts';
import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test('TagContainer should render', (t) => {
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
      <Tag post={_.head(posts)} isEditingTags setSelection={() => {}} />
    </Provider>,
  );

  const autoComplete = enzymeWrapper.find(AutoComplete);

  t.is(autoComplete.length, 1);
});

test('mapDispatchToProps', async (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const props = mapDispatchToProps(store.dispatch, { setSelection() { } });
  const p = props.addTag(_.head(posts).id, 'cheesy');
  await p;
  const actions = store.getActions();
  t.is(actions.length, 1);
});
