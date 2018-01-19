import { connect } from 'react-redux';
import {
  mapStateToProps,
  mapDispatchToProps,
  ActivateAccountFormContainer,
} from '../containers/ActivateAccountFormContainer';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActivateAccountFormContainer);
