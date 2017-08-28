import React from 'react';
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

    if (isAccountActivated === null) {
      return (
        <p>Please wait...</p>
      );
    } else if (isAccountActivated) {
      return (
        <p>Your account has been activated</p>
      );
    }

    return (
      <p>{errorMessage}</p>
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

class ActivateAccountViewContainer extends React.Component {

  render() {
    const { activateAccount, isAccountActivated, params } = this.props;

    return (
      <ActivateAccountView
        isAccountActivated={isAccountActivated}
        activateAccount={() => activateAccount(params.token)}
      />
    );
  }
}

ActivateAccountViewContainer.propTypes = {
  isAccountActivated: PropTypes.bool,
  activateAccount: PropTypes.func.isRequired,
  params: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }),
};

ActivateAccountViewContainer.defaultProps = {
  isAccountActivated: null,
  params: {
    token: undefined,
  },
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
