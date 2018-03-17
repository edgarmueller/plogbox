import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { getStatusText } from '../reducers/auth';

export class ChangePasswordFormContainer extends React.Component {

  render() {
    const { changePassword, errorMessage } = this.props;
    return (
      <ChangePasswordForm 
        errorMessage={errorMessage}
        changePassword={changePassword} 
      />
    );
  }
}

ChangePasswordFormContainer.propTypes = {
  changePassword: PropTypes.func.isRequired,
  ...ChangePasswordForm.propTypes,
};

export const mapStateToProps = state => ({
  errorMessage: getStatusText(state.auth),
});

export const mapDispatchToProps = dispatch => ({
  changePassword(currentPassword, newPassword) {
    dispatch(actions.changePassword(currentPassword, newPassword));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePasswordFormContainer);


