import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { routerActions } from 'react-router-redux';
import { Button, FormLabel } from 'material-ui';
import red from 'material-ui/colors/red';
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

  handleFormSubmit(formProps) {
    this.props.registerUser(formProps);
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
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit)}>
        <div>
          <FormLabel component="legend">Mail</FormLabel>
          <Field
            name="email"
            component={renderTextField}
            type="text"
          />
        </div>
        <div>
          <FormLabel component="legend">Password</FormLabel>
          <Field
            name="password"
            component={renderPasswordTextField}
            type="password"
          />
        </div>
        <div>
          <FormLabel component="legend">Repeat Password</FormLabel>
          <Field
            name="password-repeat"
            component={renderPasswordTextField}
            type="password"
          />
        </div>
        <Button type="submit" color="primary" >Register</Button>
        <div>
          {this.renderAlert()}
        </div>
      </form>
    );
  }
}

SignUpPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  registerUser: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
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
  { registerUser, replace: routerActions.replace },
)(form(SignUpPage));

