import React from 'react';
import { TextField } from 'redux-form-material-ui';
import PropTypes from 'prop-types';

export const renderTextField = ({ input, label, meta: { error }, ...custom }) => (
  <TextField
    error={error !== undefined}
    helperText={label}
    label={error || label}
    {...input}
    {...custom}
  />
);

renderTextField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

renderTextField.defaultProps = {
  input: '',
  label: '',
  meta: {
    touched: false,
    error: '',
  },
};

export const renderPasswordTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    error={error !== undefined}
    type="password"
    helperText={label}
    label={error || label}
    {...input}
    {...custom}
  />
);

renderPasswordTextField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

renderPasswordTextField.defaultProps = {
  input: '',
  label: '',
  meta: {
    touched: false,
    error: '',
  },
};
