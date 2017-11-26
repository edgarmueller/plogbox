import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps, EditPostContainer } from '../components/EditPostContainer';

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPostContainer));
