import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import {
  ResetPasswordFormContainer,
  mapDispatchToProps,
  mapStateToProps,
} from '../components/ResetPasswordFormContainer';

const form = reduxForm({
  form: 'reset',
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(form(ResetPasswordFormContainer));
