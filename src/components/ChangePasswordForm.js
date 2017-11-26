import React from 'react';
import { Field } from 'redux-form';
import { RaisedButton } from 'material-ui';
import PropTypes from 'prop-types';
import { renderPasswordTextField } from '../utils/helpers';

const ChangePasswordForm = ({ handleSubmit, onSubmit, renderAlert }) => (
  <form onSubmit={handleSubmit(onSubmit)}>
    <div>
      <Field
        name="currentPassword"
        component={renderPasswordTextField}
        type="password"
        label="Current Password"
      />
    </div>
    <div>
      <Field
        name="newPassword"
        component={renderPasswordTextField}
        type="password"
        label="New Password"
      />
    </div>
    <RaisedButton type="submit" label="Change password" />
    <div>
      {renderAlert()}
    </div>
  </form>
);

ChangePasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
};

export default ChangePasswordForm;
