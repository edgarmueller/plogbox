/* eslint-disable import/first */
import '../helpers/setup';
import React from 'react';
import { TextField } from 'material-ui';
import { shallow } from 'enzyme';
import path from 'path';
import fakeProps from 'react-fake-props';
import ResetPasswordForm from '../../src/components/ResetPasswordForm';
import { ResetPasswordFormContainer } from '../../src/containers/ResetPasswordFormContainer';

const componentPath = path.join(__dirname, '../../src/components/ResetPasswordForm.js');

test('ResetPasswordView should render', () => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = shallow(<ResetPasswordForm {...props} />);
  const fields = enzymeWrapper.find(TextField);
  expect(fields.length).toBe(2);
});

test('ResetPasswordFormContainer should render', () => {
  const props = fakeProps(componentPath);
  props.errorMessage = '';
  props.token = '1234';
  const enzymeWrapper = shallow(<ResetPasswordFormContainer {...props} />);
  const fields = enzymeWrapper.find(ResetPasswordForm);
  expect(fields.length).toBe(1);
});
