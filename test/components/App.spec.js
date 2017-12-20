/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import { MemoryRouter, Switch } from 'react-router';
import configureMockStore from 'redux-mock-store';

import { App } from '../../src/components/App';
import NavigationBar from '../../src/components/NavBar';

const mockStore = configureMockStore();

test('should render nav bar', () => {
  const enzymeWrapper = shallow(<App />);
  const navBar = enzymeWrapper.find(NavigationBar);
  expect(navBar.length).toBe(1);
});

test('should render router', () => {
  const store = mockStore({
    auth: {
      isAuthenticated: false,
    },
    routing: {
      location: {
        pathname: '/login',
      },
    },
  });
  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>,
  );
  expect(enzymeWrapper.find(Switch).length).toBe(1);
});
