import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, withStyles } from 'material-ui';
import { button, errorStyle, successStyle } from '../common/styles';
import * as api from '../api';
import * as CommonPropTypes from '../common/CommonPropTypes';

const styles = {
  button,
  error: errorStyle,
  success: successStyle,
};

export class ResetPasswordForm extends React.Component {
  state = {
    success: undefined,
    error: undefined,
  };

  handleSubmit = token => ev => {
    console.log('ev', ev);
    ev.preventDefault();
    api.resetPassword(token, this.state.password)
      .then(
        () => this.setState({
          success: true,
          error: undefined,
        }),
        error => this.setState({
          success: false,
          error: error.response.data.messages.join(''),
        }),
      );
  };

  render() {
    const { classes, token } = this.props;

    return (
      <form onSubmit={this.handleSubmit(token)}>
        <div>
          <TextField
            name="password"
            type="password"
            label="Password"
          />
        </div>
        <div>
          <TextField
            name="password-repeat"
            type="password"
            label="Repeat Password"
          />
        </div>
        <Button type="submit">Register</Button>
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

ResetPasswordForm.propTypes = {
  classes: CommonPropTypes.classes.isRequired,
  token: PropTypes.string.isRequired,
};

export default withStyles(styles)(ResetPasswordForm);
