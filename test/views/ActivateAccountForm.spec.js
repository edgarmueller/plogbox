/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import { shallow } from 'enzyme';
import path from 'path';
import fakeProps from 'react-fake-props';
import { ActivateAccountFormContainer } from '../../src/components/ActivateAccountFormContainer';
import ActivateAccountForm from '../../src/components/ActivateAccountForm';

const componentPath = path.join(__dirname, '../../src/components/ActivateAccountForm.js');

test('ActivateAccount should render', () => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = mountWithContext(
    <ActivateAccountFormContainer {...props} isAccountActivated />,
  );
  const p = enzymeWrapper.find('p');
  expect(p.text()).toBe('Your account has been activated');
});

test('ActivateAccount should render unactivated account', () => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = mountWithContext(
    <ActivateAccountForm {...props} isAccountActivated={false} />,
  );
  const p = enzymeWrapper.find('p');
  expect(p.text()).toBe('Please wait...');
});

test('should display error message, if present', () => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = shallow(
    <ActivateAccountForm
      {...props}
      isAccountActivated
      errorMessage={'Here is an error message'}
    />,
  );
  const p = enzymeWrapper.find('p');
  expect(p.text()).toBe('Here is an error message');
});
