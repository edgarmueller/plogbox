import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {RaisedButton} from 'material-ui';
import {redA400} from 'material-ui/styles/colors';
import PropTypes from 'prop-types';
import {renderPasswordTextField} from '../utils/helpers';
import * as actions from '../actions';

const form = reduxForm({
  form: 'change-password',
});

export const ChangePasswordForm = ({ handleSubmit, onSubmit, renderAlert }) => (
  <form onSubmit={handleSubmit(onSubmit)}>
    <div>
      <Field
        name="currentPassword"
        component={renderPasswordTextField}
        type="password"
        label="Current Password"
      />
    </div>
    <div>
      <Field
        name="newPassword"
        component={renderPasswordTextField}
        type="password"
        label="New Password"
      />
    </div>
    <RaisedButton type="submit" label="Change password" />
    <div>
      {renderAlert()}
    </div>
  </form>
);

ChangePasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
};

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
          <span style={{ color: redA400 }}>
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

ChangePasswordFormContainer.propTypes = ChangePasswordForm.propTypes;

const mapDispatchToProps = dispatch => ({
  changePassword(formProps) {
    dispatch(actions.changePassword(formProps.currentPassword, formProps.newPassword));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(form(ChangePasswordFormContainer));
