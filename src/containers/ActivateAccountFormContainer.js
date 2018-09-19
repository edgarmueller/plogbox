import React from 'react';
import { routerActions } from 'react-router-redux';
import * as api from '../api';
import ActivateAccountForm from '../components/ActivateAccountForm';

export const ActivateAccountFormContainer = ({ token }) => (
  <ActivateAccountForm activateAccount={() => api.activateAccount(token)} />
);

ActivateAccountFormContainer.propTypes = ActivateAccountForm.propTypes;

export const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps;
  return {
    token: match.params.token,
  };
};

export const mapDispatchToProps = dispatch => ({
  navigateTo(destination) {
    dispatch(routerActions.push(destination));
  },
});
