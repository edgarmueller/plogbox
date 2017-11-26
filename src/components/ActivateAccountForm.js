import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';

class ActivateAccountForm extends React.Component {

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

ActivateAccountForm.propTypes = {
  isAccountActivated: PropTypes.bool,
  errorMessage: PropTypes.string,
  activateAccount: PropTypes.func.isRequired,
};

ActivateAccountForm.defaultProps = {
  isAccountActivated: null,
  errorMessage: undefined,
};

export default ActivateAccountForm;
