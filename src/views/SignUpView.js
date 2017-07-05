import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { routerActions } from 'react-router-redux';
import { RaisedButton } from 'material-ui';
import { redA400 } from 'material-ui/styles/colors';
import PropTypes from 'prop-types';
import { registerUser } from '../actions/index';
import { renderPasswordTextField, renderTextField } from '../utils/helpers';
import '../common/tap';

const form = reduxForm({
  form: 'sign-up',
});

export class SignUpPage extends React.Component {

  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
    this.props.registerUser(formProps);
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
      <div>
        <form onSubmit={handleSubmit(this.handleFormSubmit)}>
          <div>
            <Field
              name="email"
              component={renderTextField}
              type="text"
              label="Mail"
            />
          </div>
          <div>
            <Field
              name="password"
              component={renderPasswordTextField}
              type="password"
              label="Password"
            />
          </div>
          <div>
            <Field
              name="password-repeat"
              component={renderPasswordTextField}
              type="password"
              label="Repeat Password"
            />
          </div>
          <RaisedButton type="submit" >Register</RaisedButton>
          <div>
            {this.renderAlert()}
          </div>
        </form>
      </div>
    );
  }
}

SignUpPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  registerUser: PropTypes.func.isRequired,
  redirect: PropTypes.string.isRequired,
  replace: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

SignUpPage.defaultProps = {
  errorMessage: undefined,
};

const mapStateToProps = (state, ownProps) => {
  const isAuthenticated = state.auth.isAuthenticated || false;
  const redirect = ownProps.location ? ownProps.location.query.redirect || '/' : '/';
  return {
    isAuthenticated,
    redirect,
    errorMessage: state.auth.statusText,
    message: state.auth.message,
  };
};

export const WrappedSignUpPage = form(SignUpPage);

export default connect(
  mapStateToProps,
  { registerUser, replace: routerActions.replace },
)(WrappedSignUpPage);

