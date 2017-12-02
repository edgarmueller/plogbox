import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import Avatar from 'material-ui/Avatar';
import { Button } from 'material-ui';
import { NavBar } from '../../src/components/NavBar';
import '../helpers/setup';

test('NavBar should render', (t) => {
  const props = {
    isAuthenticated: true,
    isAdmin: false,
    user: 'foo',
    navigateTo: () => {},
    logout: () => {}
  };
  const enzymeWrapper = shallow(
    <NavBar {...props} />,
  );
  const userText = enzymeWrapper.find(Avatar);
  t.deepEqual(1, userText.length);
});

test('NavBar should render for unauthenticated user', (t) => {
  const props = {
    isAuthenticated: false,
    navigateTo: () => {},
    logout: () => {},
  };
  const enzymeWrapper = shallow(
    <NavBar {...props} />,
    );

  // home, sign-up and login buttons for unauthenticated users
  const flatButtons = enzymeWrapper.find(Button);
  t.deepEqual(flatButtons.length, 3);
});
