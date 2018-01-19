import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { Button, FormLabel } from 'material-ui';
import red from 'material-ui/colors/red';
import { TextField } from 'redux-form-material-ui';

import { loginUser } from '../actions/index';
import { renderPasswordTextField } from '../utils/helpers';
import '../common/tap';
import { getStatusText } from '../reducers/auth';

const form = reduxForm({
  form: 'login',
});

export const LoginForm = ({ handleSubmit, handleFormSubmit, renderAlert }) => (
  <form onSubmit={handleSubmit(handleFormSubmit)}>
    <FormLabel component="legend">Mail</FormLabel>
    <Field name="email" component={TextField} />

    <FormLabel component="legend">Password</FormLabel>
    <Field name="password" component={renderPasswordTextField} />

    <Button type="submit" color={'primary'}>
      Login
    </Button>
    {renderAlert()}
  </form>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
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
          <span style={{ color: red }}>
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
      <div>
        <LoginForm
          handleSubmit={handleSubmit}
          handleFormSubmit={this.handleFormSubmit}
          renderAlert={this.renderAlert}
        />
        <p>
          <Link to="/password/forgot">
            <Button>
              Forgot password?
            </Button>
          </Link>
        </p>
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
)(form(LoginFormContainer));

