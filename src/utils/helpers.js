import React from 'react';
import { TextField } from 'material-ui';
import PropTypes from 'prop-types';

export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
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
    hintText={label}
    type="password"
    floatingLabelText={label}
    errorText={touched && error}
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
