import test from 'ava';
import React from 'react';
import { Field } from 'redux-form';
import { shallow } from 'enzyme';
import { afterEach, beforeEach } from '../helpers/setup';
import { ForgotForm, ForgotPasswordFormContainer } from '../../src/views/ForgotPasswordView';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test('ForgotPasswordView should render', (t) => {
  const enzymeWrapper = shallow(
    <ForgotForm
      handleSubmit={() => {}}
      renderAlert={() => {}}
    />,
  );
  const fields = enzymeWrapper.find(Field);
  t.is(fields.length, 1);
});

test('ForgotPasswordFormContainer should render', (t) => {
  const enzymeWrapper = shallow(
    <ForgotPasswordFormContainer
      handleSubmit={() => {}}
    />,
  );
  const fields = enzymeWrapper.find(ForgotForm);
  t.is(fields.length, 1);
});
