import React from 'react';
import { routerActions } from 'react-router-redux';
import * as actions from '../actions';
import ActivateAccountForm from './ActivateAccountForm';

export const ActivateAccountFormContainer =
  ({ activateAccount, isAccountActivated, token, errorMessage }) =>
    (
      <ActivateAccountForm
        isAccountActivated={isAccountActivated}
        activateAccount={() => activateAccount(token)}
        errorMessage={errorMessage}
      />
    );

ActivateAccountFormContainer.propTypes = ActivateAccountForm.propTypes;

ActivateAccountFormContainer.defaultProps = {
  isAccountActivated: null,
  token: undefined,
  errorMessage: null,
};

export const mapStateToProps = (state, ownProps) => ({
  isAccountActivated: state.auth.isAccountActivationSuccess,
  token: ownProps.params.token,
});

export const mapDispatchToProps = dispatch => ({
  navigateTo(destination) {
    dispatch(routerActions.push(destination));
  },
  activateAccount(token) {
    dispatch(actions.activateAccount(token));
  },
});
