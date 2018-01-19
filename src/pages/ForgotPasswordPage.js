import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { ForgotPasswordFormContainer, mapDispatchToProps } from '../containers/ForgotPasswordFormContainer';

const form = reduxForm({
  form: 'forgot',
});

export default connect(
  null,
  mapDispatchToProps,
)(form(ForgotPasswordFormContainer));
