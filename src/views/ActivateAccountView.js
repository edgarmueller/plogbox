import { connect } from 'react-redux';
import {
  mapStateToProps,
  mapDispatchToProps,
  ActivateAccountFormContainer
} from '../components/ActivateAccountFormContainer';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActivateAccountFormContainer);
