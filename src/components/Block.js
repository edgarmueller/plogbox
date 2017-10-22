import * as _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Latex from 'react-latex';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import * as action from '../actions/index';
import { UPDATE_BLOCK_FAILURE } from '../constants/index';

export class Block extends React.Component {

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
    switch (block.dialect) {
      case 'image':
        if (block.text) {
          if (this.state.isDownloading) {
            return (<div id={block.text}>Loading...</div>);
          }

          return (<img src={this.state.imagePath} />);
        }

        return (<div>No image selected yet</div>);
      case 'latex':
        return (
          <div id={block.text}>
            <Latex>{block.text}</Latex>
          </div>
        );
      default:
        return <ReactMarkdown id={block.id} source={block.text} />;
    }
  }
}

Block.propTypes = {
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
    console.log('block text ', block.text);
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
)(Block);
