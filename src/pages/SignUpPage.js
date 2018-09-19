import React from 'react';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { Button, TextField, withStyles } from 'material-ui';
import red from 'material-ui/colors/red';
import PropTypes from 'prop-types';
import * as api from '../api';
import '../common/tap';
import CenteredWhiteDiv from '../components/CenteredWhiteDiv';
import { button, formButtonBar } from '../common/styles';

const styles = {
  button,
  formButtonBar,
};

export class SignUpPage extends React.Component {
  state = {
    errorMessage: undefined,
  };

  handleFormSubmit = (ev) => {
    ev.preventDefault();
    console.log('current state', this.state);
    api.registerUser(this.state.email, this.state.password)
      .then(
        () => {
          this.setState({
            errorMessage: undefined,
          });
        },
        (error) => {
          this.setState({
            errorMessage: error.response.data.message,
          });
        },
      );
  };

  handleFieldUpdate = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  };

  renderAlert = () => {
    if (this.state.errorMessage) {
      return (
        <div style={{ marginTop: '1em' }}>
          <span style={{ color: red[400] }}>
            {this.props.errorMessage}
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
        <h2 style={{ paddingTop: '1em' }}>Welcome to _plog</h2>
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

          {this.renderAlert()}
        </form>
      </CenteredWhiteDiv>
    );
  }
}

SignUpPage.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.string,
  }).isRequired,
  errorMessage: PropTypes.string,
};

SignUpPage.defaultProps = {
  errorMessage: undefined,
};

const mapStateToProps = (state) => {
  const isAuthenticated = state.auth.isAuthenticated || false;
  return {
    isAuthenticated,
    errorMessage: state.auth.statusText,
    message: state.auth.message,
  };
};


export default connect(
  mapStateToProps,
  { replace: routerActions.replace },
)(withStyles(styles)(SignUpPage));

