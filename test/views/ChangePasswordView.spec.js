import test from 'ava';
import React from 'react';
import { Field } from 'redux-form';
import { shallow } from 'enzyme';
import { afterEach, beforeEach } from '../helpers/setup';
import { ChangePasswordForm, ChangePasswordFormContainer } from '../../src/views/ChangePasswordView';

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test('ChangePasswordView should render', (t) => {
  const enzymeWrapper = shallow(
    <ChangePasswordForm
      handleSubmit={() => {}}
      renderAlert={() => {}}
    />,
  );
  const fields = enzymeWrapper.find(Field);
  t.is(fields.length, 2);
});

test('ChangePasswordFormContainer should render', (t) => {
  const enzymeWrapper = shallow(
    <ChangePasswordFormContainer
      handleSubmit={() => {}}
    />,
  );
  const fields = enzymeWrapper.find(ChangePasswordForm);
  t.is(fields.length, 1);
});
