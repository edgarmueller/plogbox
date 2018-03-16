/* eslint-disable import/first */
import '../helpers/setup';
import React from 'react';
import { shallow } from 'enzyme';
import path from 'path';
import fakeProps from 'react-fake-props';
import ChangePasswordForm from '../../src/components/ChangePasswordForm';
import { ChangePasswordFormContainer } from '../../src/containers/ChangePasswordFormContainer';
import { mountWithContext } from '../helpers/setup';

const componentPath = path.join(__dirname, '../../src/components/ChangePasswordForm.js');

test('ChangePasswordView should render', () => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = mountWithContext(<ChangePasswordForm {...props} />);
  const fields = enzymeWrapper.find('input');
  expect(fields.length).toBe(3);
});

test('ChangePasswordFormContainer should render', () => {
  // fakeProps doesn't seem to work with the container's prop types
  const props = fakeProps(componentPath);
  props.changePassword = () => {};
  const enzymeWrapper = shallow(<ChangePasswordFormContainer {...props} />);
  const fields = enzymeWrapper.find(ChangePasswordForm);
  expect(fields.length).toBe(1);
});
