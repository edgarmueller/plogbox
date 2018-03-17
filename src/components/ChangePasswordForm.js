import React from 'react';
import * as _ from 'lodash';
import { Button, TextField, withStyles } from 'material-ui';
import red from 'material-ui/colors/red';
import PropTypes from 'prop-types';
import { button } from '../common/styles';

const styles = {
  button,
};

class ChangePasswordForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPassword: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    }
    this.handleUpdateCurrentPassword = this.handleUpdateCurrentPassword.bind(this);
    this.handleUpdateNewPassword = this.handleUpdateNewPassword.bind(this);
    this.handleUpdateConfirmPassword = this.handleUpdateConfirmPassword.bind(this);
    this.checkPasswords = this.checkPasswords.bind(this);
  }

  handleUpdateCurrentPassword(currentPassword) {
    this.setState({ currentPassword })
  }

  handleUpdateNewPassword(newPassword) {
    this.setState({ newPassword })
  }

  handleUpdateConfirmPassword(confirmPassword) {
    this.setState({ confirmPassword })
  }

  // TODO: dup code (where?)
  // how is error message set?
  renderAlert() {
    if (this.props.errorMessage || this.state.errorMessage) {
      return (
        <div style={{ marginTop: '1em' }}>
          <span style={{ color: red }}>
            {this.props.errorMessage || this.state.errorMessage}
          </span>
        </div>
      );
    }

    return undefined;
  }

  checkPasswords() {
    if (_.isEmpty(this.state.currentPassword)) {
      this.setState({
        errorMessage: 'Your current password must not be empty',
      })
      return false;
    } else if (_.isEmpty(this.state.newPassword)) {
      this.setState({
        errorMessage: 'Your new password must not be empty',
      })
      return false;
    } else if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({
        errorMessage: 'Passwords do not match',
      })
      return false;
    } else if (this.state.newPassword === this.state.currentPassword) {
      this.setState({
        errorMessage: 'Your new password must not be the same as your previous one'
      })
      return false;
    }

    this.setState({ errorMessage: undefined });

    return true;
  }

  render() {
    const { classes, changePassword, errorMessage } = this.props;
    return (
      <div>
        <div>
          <TextField
            name="currentPassword"
            type="password"
            label="Current Password"
            onChange={event => this.handleUpdateCurrentPassword(event.target.value)}
          />
        </div>
        <div>
          <TextField
            name="newPassword"
            type="password"
            label="New Password"
            onChange={event => this.handleUpdateNewPassword(event.target.value)}
          />
        </div>
        <div>
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
            onClick={() => {
              if (this.checkPasswords()) {
                changePassword(this.state.currentPassword, this.state.newPassword)
              }
            }}
          >
            Change password
        </Button>
        </div>
        <div>
          {
            (errorMessage || this.state.errorMessage) &&
            <div style={{ marginTop: '1em' }}>
              <span style={{ color: red[400] }}>
                {this.props.errorMessage || this.state.errorMessage}
              </span>
            </div>
          }
        </div>
      </div>
    );
  }
}

ChangePasswordForm.propTypes = {
  changePassword: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(ChangePasswordForm);
