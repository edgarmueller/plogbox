import React from 'react';
import PropTypes from 'prop-types';
import red from 'material-ui/colors/red';
import * as actions from '../actions';
import ChangePasswordForm from './ChangePasswordForm';

export class ChangePasswordFormContainer extends React.Component {

  constructor() {
    super();
    this.renderAlert = this.renderAlert.bind(this);
  }

  // TODO: dup code (where?)
  // how is error message set?
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
    const { handleSubmit, changePassword } = this.props;
    return (
      <ChangePasswordForm
        handleSubmit={handleSubmit}
        onSubmit={changePassword}
        renderAlert={this.renderAlert}
      />
    );
  }
}

ChangePasswordFormContainer.propTypes = {
  changePassword: PropTypes.func.isRequired,
  ...ChangePasswordForm.propTypes,
};

export const mapDispatchToProps = dispatch => ({
  changePassword(formProps) {
    dispatch(actions.changePassword(formProps.currentPassword, formProps.newPassword));
  },
});

