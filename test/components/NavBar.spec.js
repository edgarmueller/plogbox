/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';

import React from 'react';
import { shallow } from 'enzyme';
import { Avatar, Toolbar } from 'material-ui';
import { MemoryRouter } from 'react-router';
import { NavBar } from '../../src/components/NavBar';

test('NavBar should render', () => {
  const props = {
    isAuthenticated: true,
    isAdmin: false,
    user: 'foo',
    navigateTo: () => {},
    logout: () => {},
    classes: {
      link: 'test',
    },
  };
  const enzymeWrapper = shallow(
    <NavBar {...props} />,
  );
  const userText = enzymeWrapper.find(Avatar);
  expect(userText.length).toBe(1);
});

test('NavBar should render for unauthenticated user', () => {
  const props = {
    isAuthenticated: false,
    navigateTo: () => {},
    logout: () => {},
    classes: {
      link: 'test',
    },
  };
  const enzymeWrapper = mountWithContext(
    <MemoryRouter>
      <NavBar {...props} />
    </MemoryRouter>,
  );
  const toolbar = enzymeWrapper.find(Toolbar);
  expect(toolbar.length).toBe(1);
});
