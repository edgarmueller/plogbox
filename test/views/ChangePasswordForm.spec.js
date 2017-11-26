import test from 'ava';
import React from 'react';
import { Field } from 'redux-form';
import { shallow } from 'enzyme';
import path from 'path';
import fakeProps from 'react-fake-props';
import { afterEach, beforeEach } from '../helpers/setup';
import ChangePasswordForm from '../../src/components/ChangePasswordForm';
import { ChangePasswordFormContainer } from '../../src/components/ChangePasswordFormContainer';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

const componentPath = path.join(__dirname, '../../src/components/ChangePasswordForm.js');

test('ChangePasswordView should render', (t) => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = shallow(<ChangePasswordForm {...props} />);
  const fields = enzymeWrapper.find(Field);
  t.is(fields.length, 2);
});

test('ChangePasswordFormContainer should render', (t) => {
  // fakeProps doesn't seem to work with the container's prop types
  const props = fakeProps(componentPath);
  props.changePassword = () => {};
  const enzymeWrapper = shallow(<ChangePasswordFormContainer {...props} />);
  const fields = enzymeWrapper.find(ChangePasswordForm);
  t.is(fields.length, 1);
});
