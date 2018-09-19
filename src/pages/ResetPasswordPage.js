import { connect } from 'react-redux';
import {
  ResetPasswordFormContainer,
  mapDispatchToProps,
  mapStateToProps,
} from '../containers/ResetPasswordFormContainer';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetPasswordFormContainer);
