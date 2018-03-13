import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { Button } from 'material-ui';
import red from 'material-ui/colors/red';
import { TextField } from 'redux-form-material-ui';
import Radium from 'radium';

import { loginUser } from '../actions/index';
import '../common/tap';
import { getStatusText } from '../reducers/auth';

const buttonStyle = {
  textDecoration: 'none',
  color: '#333435',
  paddingLeft: '2em',
  paddingRight: '2em',
  borderRadius: '28px',
  border: '2px solid #80CBC4',
  height: '28px',
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: '1em',
  marginRight: '1em',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#80CBC4',
    color: '#fff',
  },
  textTransform: 'uppercase',
  fontSize: '10px',
  letterSpacing: '0.065em',
};

const forgotPasswordStyle = {
  textDecoration: 'none',
  color: '#333435',
  paddingRight: '2em',
  height: '28px',
  display: 'inline-flex',
  marginLeft: '1em',
  marginRight: '1em',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#80CBC4',
    color: '#fff',
  },
  alignItems: 'center',
  textTransform: 'uppercase',
  fontSize: '0.8em',
  letterSpacing: '0.065em',
};

const RadiumLink = Radium(Link);

export const LoginForm = ({ handleFormSubmit, renderAlert }) => (
  <form onSubmit={handleFormSubmit}>
    <TextField
      required
      type="text"
      label={'Mail address'}
    />
    <br />
    <TextField
      required
      type="password"
      label={'Password'}
    />
    <br />

    <p style={{ display: 'flex', marginTop: '1em' }}>
      <RadiumLink to="/password/forgot" style={forgotPasswordStyle} >
          Forgot password?
      </RadiumLink>
      <Button type="submit" color={'primary'} style={buttonStyle}>
        Login
      </Button>
    </p>

    {renderAlert()}
  </form>
);

LoginForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
};

class LoginFormContainer extends React.Component {

  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
  }

  handleFormSubmit(formProps) {
    this.props.loginUser(formProps);
  }

  renderAlert() {
    if (this.props.errorMessage) {
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
    const { isAuthenticated, isAuthenticating, handleSubmit, location } = this.props;
    let redirectUrl;
    if (location) {
      const search = location.search;
      const params = new URLSearchParams(search);
      redirectUrl = params.get('redirect');
    }

    if (isAuthenticated) {
      return (<Redirect to={`${_.isEmpty(redirectUrl) ? '/posts' : redirectUrl}`} />);
    }

    if (isAuthenticating) {
      return (<p>Logging in...</p>);
    }
    return (
      <div
        style={{
          paddingBottom: '1.5em',
          paddingLeft: '1em',
          backgroundColor: '#fff',
          borderBottomLeftRadius: '0.25em',
          borderBottomRightRadius: '0.25em',
          boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
          width: '40%',
          margin: 'auto',
        }}
      >
        <h2 style={{ paddingTop: '1em' }}>Welcome to _plog</h2>
        <LoginForm
          handleSubmit={handleSubmit}
          handleFormSubmit={this.handleFormSubmit}
          renderAlert={this.renderAlert}
        />
      </div>
    );
  }
}

LoginFormContainer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

LoginFormContainer.defaultProps = {
  errorMessage: undefined,
};

const mapStateToProps = (state) => {
  const isAuthenticated = state.auth.isAuthenticated || false;
  const isAuthenticating = state.auth.isAuthenticating || false;
  return {
    isAuthenticated,
    isAuthenticating,
    errorMessage: getStatusText(state.auth),
  };
};

const mapDispatchToProps = {
  loginUser,
  replace: routerActions.replace,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginFormContainer);

