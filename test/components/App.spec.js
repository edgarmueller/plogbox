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

test('should render', (t) => {
  const enzymeWrapper = shallow(<App />);
  const navBar = enzymeWrapper.find(NavigationBar);
  t.is(navBar.length, 1);
});

test('Root should render', (t) => {
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

  t.is(1, enzymeWrapper.find(router.Router).length);
});
