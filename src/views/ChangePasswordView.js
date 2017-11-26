import { reduxForm } from 'redux-form';
import { connect, mapDispatchToProps } from 'react-redux';
import { ChangePasswordFormContainer } from '../components/ChangePasswordFormContainer';

const form = reduxForm({
  form: 'change-password',
});

export default connect(
  null,
  mapDispatchToProps,
)(form(ChangePasswordFormContainer));
