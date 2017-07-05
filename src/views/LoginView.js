import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { RaisedButton } from 'material-ui';
import { redA400 } from 'material-ui/styles/colors';

import { loginUser } from '../actions/index';
import { renderTextField, renderPasswordTextField } from '../utils/helpers';
import '../common/tap';

const form = reduxForm({
  form: 'login',
});

export const LoginForm = ({ handleSubmit, handleFormSubmit, renderAlert }) => (
  <form onSubmit={handleSubmit(handleFormSubmit)}>
    <div>
      <Field name="email" component={renderTextField} label="Email" />
    </div>
    <div>
      <Field name="password" component={renderPasswordTextField} label="Password" />
    </div>
    <div>
      <RaisedButton type="submit" >Login</RaisedButton>
    </div>
    <div>
      {renderAlert()}
    </div>
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
          <span style={{ color: redA400 }}>
            {this.props.errorMessage}
          </span>
        </div>
      );
    }

    return undefined;
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <LoginForm
        handleSubmit={handleSubmit}
        handleFormSubmit={this.handleFormSubmit}
        renderAlert={this.renderAlert}
      />
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
    errorMessage: state.auth.statusText,
    message: state.auth.message,
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

