import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { RaisedButton } from 'material-ui';
import { redA400 } from 'material-ui/styles/colors';
import PropTypes from 'prop-types';
import { renderPasswordTextField } from '../utils/helpers';
import * as actions from '../actions';

const form = reduxForm({
  form: 'reset',
});

export const ResetForm = ({ handleSubmit, onSubmit, renderAlert }) => (
  <form onSubmit={handleSubmit(onSubmit)}>
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
      {renderAlert()}
    </div>
  </form>
);

ResetForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
};

export class ResetPasswordFormContainer extends React.Component {

  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
  }

  handleFormSubmit(token) {
    return formProps => this.props.resetPassword(token, formProps);
  }

  // TODO: dup code
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
    const { handleSubmit, params } = this.props;
    return (
      <ResetForm
        handleSubmit={handleSubmit}
        onSubmit={this.handleFormSubmit(params.token)}
        renderAlert={this.renderAlert}
      />
    );
  }
}

ResetPasswordFormContainer.propTypes = {
  // isAuthenticated: PropTypes.bool.isRequired,
  // replace: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  // redirect: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};


ResetPasswordFormContainer.defaultProps = {
  errorMessage: undefined,
};

const mapDispatchToProps = dispatch => ({
  resetPassword(token, formProps) {
    dispatch(actions.resetPassword(token)(formProps.password));
    dispatch(routerActions.push('/'));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(form(ResetPasswordFormContainer));
