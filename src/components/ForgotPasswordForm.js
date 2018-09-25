import React from 'react';
import { Button, TextField, withStyles } from 'material-ui';
import { button as buttonStyle, errorStyle } from '../common/styles';
import * as CommonPropTypes from '../common/CommonPropTypes';
import * as api from '../api';

const styles = {
  button: {
    ...buttonStyle,
    marginLeft: '2em',
  },
  error: errorStyle,
};

class ForgotPasswordForm extends React.Component {

  state = {
    mail: undefined,
    error: undefined,
    success: undefined,
  };

  handleUpdateMail = (mail) => {
    this.setState({
      mail,
    });
  };

  handleFormSubmit = (ev) => {
    console.log('forget pw', ev);
    ev.preventDefault();
    api.forgotPassword(this.state.mail)
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
    const { classes } = this.props;

    return (
      <form onSubmit={this.handleFormSubmit}>
        <div>
          <TextField
            name="email"
            label="Mail Address"
            onChange={event => this.handleUpdateMail(event.target.value)}
          />
          <Button
            type="submit"
            className={classes.button}
          >
            Reset password
          </Button>
        </div>
        {
          this.state.success &&
            <div className={classes.success}>
              A mail with further instructions has been sent to the given mail address.
            </div>
        }
        {
          this.state.error &&
          <div className={classes.error}>
            {this.state.error}
          </div>
        }
      </form>
    );
  }
}

ForgotPasswordForm.propTypes = {
  classes: CommonPropTypes.classes.isRequired,
};

export default withStyles(styles)(ForgotPasswordForm);
