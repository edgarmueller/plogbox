import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as action from '../actions/index';
import RenderedBlock from '../components/RenderedBlock';

export class RenderedBlockContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDownloading: false,
      imagePath: localStorage.getItem(props.block.text),
    };
    this.download = this.download.bind(this);
  }

  componentWillMount() {
    this.download();
  }

  componentDidUpdate() {
    this.download();
  }

  download() {
    const { postId, block, downloadFile } = this.props;

    if (block.dialect === 'image' &&
      block.text &&
      !this.state.isDownloading &&
      (this.state.imagePath === null || this.state.imagePath === undefined)) {
      this.setState({ isDownloading: true });
      downloadFile(
        postId,
        block,
        () => {
          this.setState({
            imagePath: localStorage.getItem(block.text),
            isDownloading: false,
          });
        },
      );
    }
  }

  render() {
    const { block, isFocused } = this.props;

    return (<RenderedBlock
      block={block}
      isDownloading={this.state.isDownloading}
      imagePath={this.state.imagePath}
      isFocused={isFocused}
    />);
  }
}

RenderedBlockContainer.propTypes = {
  postId: PropTypes.number.isRequired,
  block: PropTypes.shape({
    dialect: PropTypes.string.isRequired,
    name: PropTypes.string,
    text: PropTypes.string.isRequired,
  }).isRequired,
  downloadFile: PropTypes.func.isRequired,
  isFocused: PropTypes.bool,
};

RenderedBlockContainer.defaultProps = {
  isFocused: false,
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
    const p = dispatch(action.downloadFile(postId, file));
    return p.then(
      (fileData) => {
        localStorage.setItem(file, fileData);
        success();
      },
    );
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(RenderedBlockContainer);
