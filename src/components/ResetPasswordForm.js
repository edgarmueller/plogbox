import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from 'material-ui';

const ResetPasswordForm = ({ handleSubmit, onSubmit, renderAlert }) => (

  <form onSubmit={handleSubmit(onSubmit)}>
    <div>
      <TextField
        name="password"
        type="password"
        label="Password"
      />
    </div>
    <div>
      <TextField
        name="password-repeat"
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
