/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import * as Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Chip } from 'material-ui';
import Tag, { mapDispatchToProps } from '../../src/containers/TagsContainer';
import { posts } from '../helpers/posts';
import Autosuggest from 'react-autosuggest';
import { BASE_URL } from '../../src/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


test('TagContainer should render tags', () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });

  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <Tag
        post={_.head(posts)}
        setSelection={() => { }}
        done={() => {}}
      />
    </Provider>,
  );
  const chips = enzymeWrapper.find(Chip);
  expect(chips.length).toBe(2);
});

test('should render Autosuggest when in edit mode', () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <Tag
        post={_.head(posts)}
        isEditing
        setSelection={() => {}}
        done={() => {}}
      />
    </Provider>,
  );
  const autoComplete = enzymeWrapper.find(Autosuggest);
  expect(autoComplete.length).toBe(1);
});

test('delete a tag', () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  let didDelete = false;
  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <Tag
        post={_.head(posts)}
        setSelection={() => {}}
        done={() => {
          didDelete = true;
        }}
      />
    </Provider>,
  );
  const chips = enzymeWrapper.find(Chip);
  chips.first().props().onDelete();
  expect(didDelete).toBeTruthy();
});

test('mapDispatchToProps', async () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const mock = new MockAdapter(Axios);
  mock.onPost(`${BASE_URL}/tags/0`).reply(200, {
    status: 'success',
    data: {
      data: {
        tag: 'cheesy',
      },
    },
  });
  const props = mapDispatchToProps(store.dispatch, { setSelection() { } });
  await props.addTag(_.head(posts).id, 'cheesy');
  const actions = store.getActions();
  expect(actions.length).toBe(1);
});
