import React from 'react';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { Button, TextField, withStyles } from 'material-ui';
import red from 'material-ui/colors/red';
import PropTypes from 'prop-types';
import * as api from '../api';
import '../common/tap';
import CenteredWhiteDiv from '../components/CenteredWhiteDiv';
import { button, errorStyle, formButtonBar, inProgressStyle, successStyle } from '../common/styles';

const styles = {
  button,
  error: errorStyle,
  inProgress: inProgressStyle,
  formButtonBar,
  success: successStyle,
};

export class SignUpPage extends React.Component {
  state = {
    success: undefined,
    error: undefined,
    inProgress: false,
  };

  handleFormSubmit = (ev) => {
    ev.preventDefault();
    this.setState(() => ({
      inProgress: true,
      error: undefined,
      success: undefined,
    }));
    api.registerUser(this.state.email, this.state.password)
      .then(
        () => {
          this.setState(() => ({
            success: true,
            error: undefined,
            inProgress: false,
          }));
        },
        (error) => {
          this.setState(() => ({
            success: false,
            error: error.response.data.messages.join(''),
            inProgress: false,
          }));
        },
      );
  };

  handleFieldUpdate = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  };

  renderAlert = () => {
    if (this.state.error) {
      return (
        <div style={{ marginTop: '1em' }}>
          <span style={{ color: red[400] }}>
            {this.props.error}
          </span>
        </div>
      );
    }

    return undefined;
  }

  render() {
    const { classes } = this.props;

    return (
      <CenteredWhiteDiv>
        <h2 style={{ paddingTop: '1em' }}>Sign up for _plog</h2>
        <form onSubmit={this.handleFormSubmit}>
          <div>
            <TextField
              required
              label="Mail"
              name="email"
              onChange={this.handleFieldUpdate}
              type="text"
            />
          </div>
          <div>
            <TextField
              required
              label="Password"
              name="password"
              onChange={this.handleFieldUpdate}
              type="password"
            />
          </div>
          <div>
            <TextField
              required
              label="Repeat password"
              name="password-repeat"
              onChange={this.handleFieldUpdate}
              type="password"
            />
          </div>
          <p className={classes.formButtonBar}>
            <Button
              type="submit"
              color="primary"
              className={classes.button}
            >
              Register
            </Button>
          </p>
          {
            this.state.inProgress &&
              <div className={classes.inProgress}>
                Please wait...
              </div>
          }
          {
            this.state.success &&
              <div className={classes.success}>
                We have sent you a mail with further instructions!
              </div>
          }
          {
            this.state.error &&
            <div className={classes.error}>
                {this.state.error}
            </div>
          }
        </form>
      </CenteredWhiteDiv>
    );
  }
}

SignUpPage.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.string,
  }).isRequired,
  error: PropTypes.string,
};

SignUpPage.defaultProps = {
  error: undefined,
};

const mapStateToProps = (state) => {
  const { isAuthenticated } = state.auth;
  return {
    isAuthenticated,
  };
};


export default connect(
  mapStateToProps,
  { replace: routerActions.replace },
)(withStyles(styles)(SignUpPage));

