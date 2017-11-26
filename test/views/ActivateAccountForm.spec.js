import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import path from 'path';
import fakeProps from 'react-fake-props';
import { ActivateAccountFormContainer } from '../../src/components/ActivateAccountFormContainer';
import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';
import ActivateAccountForm from '../../src/components/ActivateAccountForm';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

const componentPath = path.join(__dirname, '../../src/components/ActivateAccountForm.js');

test('ActivateAccount should render', (t) => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = mountWithContext(t,
    <ActivateAccountFormContainer {...props} isAccountActivated />,
  );
  const p = enzymeWrapper.find('p');
  t.is(p.text(), 'Your account has been activated');
});

test('ActivateAccount should render unactivated account', (t) => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = mountWithContext(t,
    <ActivateAccountForm {...props} isAccountActivated={false} />,
  );
  const p = enzymeWrapper.find('p');
  t.is(p.text(), 'Please wait...');
});

test('should display error message, if present', (t) => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = shallow(
    <ActivateAccountForm
      {...props}
      isAccountActivated
      errorMessage={'Here is an error message'}
    />,
  );
  const p = enzymeWrapper.find('p');
  t.is(p.text(), 'Here is an error message');
});
