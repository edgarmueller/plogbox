/* eslint-disable import/first */
import '../helpers/setup';
import React from 'react';
import { Field } from 'redux-form';
import { shallow } from 'enzyme';
import path from 'path';
import fakeProps from 'react-fake-props';
import ForgotPasswordForm from '../../src/components/ForgotPasswordForm';
import { ForgotPasswordFormContainer } from '../../src/components/ForgotPasswordFormContainer';

const componentPath = path.join(__dirname, '../../src/components/ForgotPasswordForm.js');

test('should render', () => {
  const props = fakeProps(componentPath);
  props.forgotPassword = () => {};
  props.loginUser = () => {};
  const enzymeWrapper = shallow(<ForgotPasswordForm {...props} />);
  const fields = enzymeWrapper.find(Field);
  expect(fields.length).toBe(1);
});

test('ForgotPasswordFormContainer should render', () => {
  const props = fakeProps(componentPath);
  props.forgotPassword = () => {};
  props.loginUser = () => {};
  const enzymeWrapper = shallow(<ForgotPasswordFormContainer {...props} />);
  const fields = enzymeWrapper.find(ForgotPasswordForm);
  expect(fields.length).toBe(1);
});
