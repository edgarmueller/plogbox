/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import 'react-dates/initialize';
import React from 'react';
import Immutable from 'immutable';
import Logbook from '../../src/views/Logbook';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router';
import thunk from 'redux-thunk';
import { posts } from '../helpers/posts';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('Logbook should render', () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
    blocks: {
      blocks: Immutable.List(),
    },
    auth: {
      userId: 0,
    },
  });
  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <MemoryRouter>
        <Logbook
          handleSubmit={() => {}}
          renderAlert={() => {}}
        />
      </MemoryRouter>
    </Provider>,
  );
  const h1 = enzymeWrapper.find('h1');
  expect(h1.length).toBe(1);
});
