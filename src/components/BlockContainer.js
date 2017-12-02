import * as _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as action from '../actions/index';
import { UPDATE_BLOCK_FAILURE } from '../constants/index';
import Block from './Block';

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

      this.setState({
        isDownloading: true,
      });
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

export const mapDispatchToProps = dispatch => ({
  /**
   * Download a given file
   *
   * @param postId the ID of the post the block is belonging to
   * @param block the block that determines which file to be downloaded
   * @param success callback to call when download is finished
   */
  downloadFile(postId, block, success) {
    const file = block.text;
    dispatch(
      action.downloadFile(postId, file)(
        (fileData) => {
          localStorage.setItem(`block_${block.id}_image`, fileData);
          success();
        },
        error => action.errorHandler(dispatch, error, UPDATE_BLOCK_FAILURE),
      ));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(BlockContainer);
