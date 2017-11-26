import test from 'ava';
import React from 'react';
import { Field } from 'redux-form';
import { shallow } from 'enzyme';
import path from 'path';
import fakeProps from 'react-fake-props';
import { afterEach, beforeEach } from '../helpers/setup';
import ForgotPasswordForm from '../../src/components/ForgotPasswordForm';
import { ForgotPasswordFormContainer } from '../../src/components/ForgotPasswordFormContainer';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

const componentPath = path.join(__dirname, '../../src/components/ForgotPasswordForm.js');

test('should render', (t) => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = shallow(<ForgotPasswordForm {...props} />);
  const fields = enzymeWrapper.find(Field);
  t.is(fields.length, 1);
});

test('ForgotPasswordFormContainer should render', (t) => {
  const props = fakeProps(componentPath);
  props.forgotPassword = () => {};
  const enzymeWrapper = shallow(<ForgotPasswordFormContainer {...props} />);
  const fields = enzymeWrapper.find(ForgotPasswordForm);
  t.is(fields.length, 1);
});
