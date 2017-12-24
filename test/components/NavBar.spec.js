/* eslint-disable import/first */
import '../helpers/setup';

import React from 'react';
import { shallow } from 'enzyme';
import Avatar from 'material-ui/Avatar';
import { NavBar } from '../../src/components/NavBar';
import { Link } from 'react-router-dom';

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
  const enzymeWrapper = shallow(<NavBar {...props} />);
  // home, sign-up and login buttons for unauthenticated users
  const flatButtons = enzymeWrapper.find(Link);
  expect(flatButtons.length).toBe(3);
});
