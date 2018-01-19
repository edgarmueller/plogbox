import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { ChangePasswordFormContainer, mapDispatchToProps } from '../containers/ChangePasswordFormContainer';

const form = reduxForm({
  form: 'change-password',
});

export default connect(
  null,
  mapDispatchToProps,
)(form(ChangePasswordFormContainer));
