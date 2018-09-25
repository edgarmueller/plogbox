/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import path from 'path';
import fakeProps from 'react-fake-props';
import ChangePasswordForm from '../../src/components/ChangePasswordForm';

const componentPath = path.join(__dirname, '../../src/components/ChangePasswordForm.js');

test('ChangePasswordView should render', () => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = mountWithContext(<ChangePasswordForm {...props} />);
  const fields = enzymeWrapper.find('input');
  expect(fields.length).toBe(3);
});
