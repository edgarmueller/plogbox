import React from 'react';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import red from 'material-ui/colors/red';
import * as actions from '../actions';
import ResetPasswordForm from './ResetPasswordForm';

export class ResetPasswordFormContainer extends React.Component {

  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
  }

  handleFormSubmit(token) {
    return formProps => this.props.resetPassword(token, formProps);
  }

  // TODO: dup code, extract to HOC
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
    const { handleSubmit, token } = this.props;
    return (
      <ResetPasswordForm
        handleSubmit={handleSubmit}
        onSubmit={this.handleFormSubmit(token)}
        renderAlert={this.renderAlert}
      />
    );
  }
}

ResetPasswordFormContainer.propTypes = {
  errorMessage: PropTypes.string,
  token: PropTypes.string.isRequired,
  ...ResetPasswordForm.propTypes,
};

ResetPasswordFormContainer.defaultProps = {
  errorMessage: undefined,
};

export const mapStateToProps = (state, ownProps) => ({
  token: ownProps.params,
});

export const mapDispatchToProps = dispatch => ({
  resetPassword(token, formProps) {
    dispatch(actions.resetPassword(token)(formProps.password))
      .then(
        () => dispatch(routerActions.push('/')),
      );
  },
});

