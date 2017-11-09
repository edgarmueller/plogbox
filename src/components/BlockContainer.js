import * as _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as action from '../actions/index';
import { UPDATE_BLOCK_FAILURE } from '../constants/index';
import { Block } from './Block';

export class BlockContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDownloading: false,
      imagePath: localStorage.getItem(`block_${props.block.id}_image`),
    };
  }

  componentDidUpdate() {
    const { postId, block, downloadFile } = this.props;
    if (block.dialect === 'image' &&
      block.text &&
      !this.state.isDownloading &&
      _.isEmpty(this.state.imagePath)) {
      this.setIsDownloading();
      downloadFile(
        postId,
        block,
        () => {
          this.setState({
            imagePath: localStorage.getItem(`block_${block.id}_image`),
            isDownloading: false,
          });
        },
      );
    }
  }

  setIsDownloading() {
    this.setState({
      isDownloading: true,
    });
  }

  render() {
    const { block } = this.props;
    return (<Block
      block={block}
      isDownloading={this.state.isDownloading}
      imagePath={this.state.imagePath}
    />);
  }
}

BlockContainer.propTypes = {
  postId: PropTypes.number.isRequired,
  block: PropTypes.shape({
    id: PropTypes.number.isRequired,
    dialect: PropTypes.string.isRequired,
    name: PropTypes.string,
    text: PropTypes.string.isRequired,
  }).isRequired,
  downloadFile: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  downloadFile(postId, block, fun) {
    const file = block.text;
    dispatch(
      action.downloadFile(postId, file)(
        (downloadedFile) => {
          localStorage.setItem(`block_${block.id}_image`, downloadedFile);
          fun();
        },
        error => action.errorHandler(dispatch, error, UPDATE_BLOCK_FAILURE),
      ));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(BlockContainer);