import React from 'react';
import { connect } from 'react-redux';
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

  componentWillMount() {
    const { isAuthenticated, replace, redirect } = this.props;
    if (isAuthenticated) {
      replace(redirect);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, replace, redirect } = nextProps;
    const { isAuthenticated: wasAuthenticated } = this.props;

    if (!wasAuthenticated && isAuthenticated) {
      replace(redirect);
    }
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
    const { handleSubmit, replace } = this.props;
    return (
      <div>
        <LoginForm
          handleSubmit={handleSubmit}
          handleFormSubmit={this.handleFormSubmit}
          renderAlert={this.renderAlert}
        />
        <p>
          <Button
            onClick={() => replace('/password/forgot')}
          >
            Forgot password?
          </Button>
        </p>
      </div>
    );
  }
}

LoginFormContainer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  replace: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  redirect: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

LoginFormContainer.defaultProps = {
  errorMessage: undefined,
};

const mapStateToProps = (state, ownProps) => {
  const isAuthenticated = state.auth.isAuthenticated || false;
  const redirect = ownProps.location.query.redirect || '/';
  return {
    isAuthenticated,
    redirect,
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

