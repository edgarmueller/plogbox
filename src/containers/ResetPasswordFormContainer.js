import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ResetPasswordForm from '../components/ResetPasswordForm';

export const ResetPasswordFormContainer = ({ token }) => (
  <ResetPasswordForm token={token} />
);

ResetPasswordFormContainer.propTypes = {
  token: PropTypes.string.isRequired,
};


export const mapStateToProps = (state, ownProps) => ({
  token: ownProps.params,
});

// export const mapDispatchToProps = dispatch => ({
//   resetPassword(token, formProps) {
//     dispatch(actions.resetPassword(token)(formProps.password))
//       .then(
//         () => dispatch(routerActions.push('/')),
//       );
//   },
// });


export default connect(mapStateToProps, null)(ResetPasswordFormContainer);
