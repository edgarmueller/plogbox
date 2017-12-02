import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Button } from 'material-ui';
import { renderPasswordTextField } from '../utils/helpers';

const ResetPasswordForm = ({ handleSubmit, onSubmit, renderAlert }) => (

  <form onSubmit={handleSubmit(onSubmit)}>
    <div>
      <Field
        name="password"
        component={renderPasswordTextField}
        type="password"
        label="Password"
      />
    </div>
    <div>
      <Field
        name="password-repeat"
        component={renderPasswordTextField}
        type="password"
        label="Repeat Password"
      />
    </div>
    <Button type="submit" >Register</Button>
    <div>
      {renderAlert()}
    </div>
  </form>
);

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
};

export default ResetPasswordForm;
