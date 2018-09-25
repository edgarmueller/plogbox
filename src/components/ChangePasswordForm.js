import React from 'react';
import * as _ from 'lodash';
import { Button, TextField, withStyles } from 'material-ui';
import { button, errorStyle, successStyle } from '../common/styles';
import * as CommonPropTypes from '../common/CommonPropTypes';
import * as api from '../api';

const styles = {
  button,
  error: errorStyle,
  success: successStyle,
};

class ChangePasswordForm extends React.Component {
  state = {
    currentPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
    success: undefined,
  };

  handleUpdateCurrentPassword = currentPassword => this.setState({ currentPassword });

  handleUpdateNewPassword = newPassword => this.setState({ newPassword });

  handleUpdateConfirmPassword = confirmPassword => this.setState({ confirmPassword });

  checkPasswords = () => {
    if (_.isEmpty(this.state.currentPassword)) {
      this.setState({
        error: 'Your current password must not be empty',
      });
      return false;
    } else if (_.isEmpty(this.state.newPassword)) {
      this.setState({
        error: 'Your new password must not be empty',
      });
      return false;
    } else if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({
        error: 'Passwords do not match',
      });
      return false;
    } else if (this.state.newPassword === this.state.currentPassword) {
      this.setState({
        error: 'Your new password must not be the same as your previous one',
      });
      return false;
    }

    this.setState({ error: undefined });

    return true;
  };

  handleSubmit = () => {
    if (this.checkPasswords()) {
      api.changePassword(this.state.currentPassword, this.state.newPassword)
        .then(
          () => this.setState({ success: true }),
          error => this.setState({
            success: false,
            error: error.response.data.messages.join(''),
          }),
        );
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          name="currentPassword"
          type="password"
          label="Current Password"
          onChange={event => this.handleUpdateCurrentPassword(event.target.value)}
        />
        <TextField
          name="newPassword"
          type="password"
          label="New Password"
          onChange={event => this.handleUpdateNewPassword(event.target.value)}
        />
        <TextField
          name="confirmPassword"
          type="password"
          label="Confirm new Password"
          onChange={event => this.handleUpdateConfirmPassword(event.target.value)}
        />
        <Button
          type="submit"
          className={classes.button}
          style={{ marginLeft: '4em' }}
        >
          Change password
        </Button>
        {
          this.state.success &&
          <div className={classes.success}>
            Password changes successfully
          </div>
        }
        {
          this.state.error &&
          (
            <div className={classes.error}>
              {this.state.error}
            </div>
          )
        }
      </form>
    );
  }
}

ChangePasswordForm.propTypes = {
  classes: CommonPropTypes.classes.isRequired,
};

export default withStyles(styles)(ChangePasswordForm);
