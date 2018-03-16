/* eslint-disable import/first */
import '../helpers/setup';
import React from 'react';
import { shallow } from 'enzyme';
import path from 'path';
import fakeProps from 'react-fake-props';
import ForgotPasswordForm from '../../src/components/ForgotPasswordForm';
import { ForgotPasswordPage } from '../../src/pages/ForgotPasswordPage';
import { mountWithContext } from '../helpers/setup';

const componentPath = path.join(__dirname, '../../src/components/ForgotPasswordForm.js');

test('should render', () => {
  const props = fakeProps(componentPath);
  props.forgotPassword = () => {};
  props.loginUser = () => {};
  const enzymeWrapper = mountWithContext(<ForgotPasswordForm {...props} />);
  const fields = enzymeWrapper.find('input');
  expect(fields.length).toBe(1);
});

test('ForgotPasswordPage should render', () => {
  const props = fakeProps(componentPath);
  props.forgotPassword = () => {};
  props.loginUser = () => {};
  const enzymeWrapper = shallow(<ForgotPasswordPage {...props} />);
  const fields = enzymeWrapper.find(ForgotPasswordForm);
  expect(fields.length).toBe(1);
});
