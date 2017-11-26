import test from 'ava';
import React from 'react';
import { Field } from 'redux-form';
import { shallow } from 'enzyme';
import path from 'path';
import fakeProps from 'react-fake-props';
import { afterEach, beforeEach } from '../helpers/setup';
import ResetPasswordForm from '../../src/components/ResetPasswordForm';
import { ResetPasswordFormContainer } from '../../src/components/ResetPasswordFormContainer';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

const componentPath = path.join(__dirname, '../../src/components/ResetPasswordForm.js');

test('ResetPasswordView should render', (t) => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = shallow(<ResetPasswordForm {...props} />);
  const fields = enzymeWrapper.find(Field);
  t.is(fields.length, 2);
});

test('ResetPasswordFormContainer should render', (t) => {
  const props = fakeProps(componentPath);
  props.errorMessage = '';
  props.token = '1234';
  const enzymeWrapper = shallow(<ResetPasswordFormContainer {...props} />);
  const fields = enzymeWrapper.find(ResetPasswordForm);
  t.is(fields.length, 1);
});
