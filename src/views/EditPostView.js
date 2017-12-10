import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import EditPostContainer, { mapDispatchToProps, mapStateToProps } from '../components/EditPostContainer';

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPostContainer));
