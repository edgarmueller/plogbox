import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';
import { errorStyle } from '../common/styles';
import CenteredWhiteDiv from './CenteredWhiteDiv';
import * as CommonPropTypes from '../common/CommonPropTypes';

const styles = {
  error: errorStyle,
};

class ActivateAccountForm extends React.Component {
  state = {
    success: undefined,
    errorMsg: undefined,
  };

  componentDidMount() {
    this.props.activateAccount()
      .then(
        () => this.setState({
          success: true,
          errorMsg: undefined,
        }),
        error => this.setState({
          success: false,
          errorMsg: error.response.data.messages.join(''),
        }),
      );
  }

  render() {
    const { classes } = this.props;

    if (this.state.success) {
      return (
        <p>Your account has been activated</p>
      );
    } else if (this.state.success === false) {
      return (
        <CenteredWhiteDiv>
          <p className={classes.error}>
            <strong>An error occurred while activating your account</strong>: {this.state.errorMsg}
          </p>
        </CenteredWhiteDiv>
      );
    }

    return (
      <p>Please wait...</p>
    );
  }
}

ActivateAccountForm.propTypes = {
  activateAccount: PropTypes.func.isRequired,
  classes: CommonPropTypes.classes.isRequired,
};

export default withStyles(styles)(ActivateAccountForm);
