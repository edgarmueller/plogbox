import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import { createStore, combineReducers } from 'redux';
import * as router from 'react-router';
import { routerReducer } from 'react-router-redux';

import authReducer from '../../src/reducers/auth';
import App from '../../src/components/App';
import Root from '../../src/components/Root';
import NavigationBar from '../../src/components/NavBar';
import { afterEach, beforeEach } from '../helpers/setup';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('should render', (t) => {
  const enzymeWrapper = shallow(<App />);
  const navBar = enzymeWrapper.find(NavigationBar);
  t.is(navBar.length, 1);
});

test.serial('Root should render', (t) => {
  router.browserHistory = {
    push: () => { },
    listen: () => { },
  };
  const store = createStore(combineReducers({
    auth: authReducer,
    routing: routerReducer,
  }));
  const enzymeWrapper = shallow(
    <Root store={store} />,
    );

  const r = enzymeWrapper.find(router.Router);
  t.deepEqual(1, r.length);
});
