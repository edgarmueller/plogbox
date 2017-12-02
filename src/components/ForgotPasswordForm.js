import React from 'react';
import { Field } from 'redux-form';
import { Button } from 'material-ui';
import PropTypes from 'prop-types';
import { renderTextField } from '../utils/helpers';

const ForgotPasswordForm = ({ handleSubmit, handleFormSubmit, renderAlert }) => (
  <form onSubmit={handleSubmit(handleFormSubmit)}>
    <div>
      <Field name="email" component={renderTextField} label="Email" />
    </div>
    <div>
      <Button type="submit" label="Reset password" />
    </div>
    <div>
      {renderAlert()}
    </div>
  </form>
);

ForgotPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
};

export default ForgotPasswordForm;
