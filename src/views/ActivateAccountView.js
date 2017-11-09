import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions';

export class ActivateAccountView extends React.Component {

  componentDidMount() {
    this.props.activateAccount();
  }

  render() {
    const { isAccountActivated, errorMessage } = this.props;

    if (!_.isEmpty(errorMessage)) {
      return (
        <p>{errorMessage}</p>
      );
    }

    if (isAccountActivated) {
      return (
        <p>Your account has been activated</p>
      );
    }

    return (
      <p>Please wait...</p>
    );
  }
}

ActivateAccountView.propTypes = {
  isAccountActivated: PropTypes.bool,
  errorMessage: PropTypes.string,
  activateAccount: PropTypes.func.isRequired,
};

ActivateAccountView.defaultProps = {
  isAccountActivated: null,
  errorMessage: undefined,
};

export const ActivateAccountViewContainer =
  ({ activateAccount, isAccountActivated, params, errorMessage } ) =>
    (
      <ActivateAccountView
        isAccountActivated={isAccountActivated}
        activateAccount={() => activateAccount(params.token)}
        errorMessage={errorMessage}
      />
    );

ActivateAccountViewContainer.propTypes = {
  isAccountActivated: PropTypes.bool,
  activateAccount: PropTypes.func.isRequired,
  params: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }),
  errorMessage: PropTypes.string,
};

ActivateAccountViewContainer.defaultProps = {
  isAccountActivated: null,
  params: {
    token: undefined,
  },
  errorMessage: null,
};

const mapStateToProps = state => ({
  isAccountActivated: state.auth.isAccountActivationSuccess,
});

const mapDispatchToProps = dispatch => ({
  navigateTo(destination) {
    dispatch(routerActions.push(destination));
  },
  activateAccount(token) {
    dispatch(actions.activateAccount(token));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActivateAccountViewContainer);
