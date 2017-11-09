import test from 'ava';
import React from 'react';
import { Field } from 'redux-form';
import { shallow } from 'enzyme';
import { afterEach, beforeEach } from '../helpers/setup';
import { ResetPasswordForm, ResetPasswordFormContainer } from '../../src/views/ResetPasswordView';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test('ResetPasswordView should render', (t) => {
  const enzymeWrapper = shallow(
    <ResetPasswordForm
      handleSubmit={() => {}}
      renderAlert={() => {}}
    />,
  );
  const fields = enzymeWrapper.find(Field);
  t.is(fields.length, 2);
});

test('ResetPasswordFormContainer should render', (t) => {
  const enzymeWrapper = shallow(
    <ResetPasswordFormContainer
      handleSubmit={() => {}}
      params={{ token: 1234 }}
    />,
  );
  const fields = enzymeWrapper.find(ResetPasswordForm);
  t.is(fields.length, 1);
});
