import React from 'react';
import * as routerActions from 'react-router-redux';
import PropTypes from 'prop-types';
import ForgotPasswordForm from './ForgotPasswordForm';
import * as actions from '../actions';

export const ForgotPasswordFormContainer = ({ handleSubmit, handleFormSubmit, renderAlert }) => (
  <ForgotPasswordForm
    handleSubmit={handleSubmit}
    handleFormSubmit={handleFormSubmit}
    renderAlert={renderAlert}
  />
);

ForgotPasswordFormContainer.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  ...ForgotPasswordForm.propTypes,
};

export const mapDispatchToProps = dispatch => ({
  forgotPassword(formProps) {
    dispatch(actions.forgotPassword(formProps.email));
    dispatch(routerActions.push('/'));
  },
});
