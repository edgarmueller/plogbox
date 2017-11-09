import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import { ActivateAccountView } from '../../src/views/ActivateAccountView';
import { afterEach, beforeEach } from '../helpers/setup';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test('ActivateAccount should render', (t) => {
  const enzymeWrapper = shallow(
    <ActivateAccountView
      isAccountActivated
      activateAccount={() => {}}
    />,
  );
  const p = enzymeWrapper.find('p');
  t.is(p.text(), 'Your account has been activated');
});

test('ActivateAccount should render unactivated account', (t) => {
  const enzymeWrapper = shallow(
    <ActivateAccountView
      isAccountActivated={false}
      activateAccount={() => {}}
    />,
  );
  const p = enzymeWrapper.find('p');
  t.is(p.text(), 'Please wait...');
});

test('should display error message, if presentn', (t) => {
  const enzymeWrapper = shallow(
    <ActivateAccountView
      isAccountActivated
      errorMessage={'Here is an error message'}
    />,
  );
  const p = enzymeWrapper.find('p');
  t.is(p.text(), 'Here is an error message');
});
