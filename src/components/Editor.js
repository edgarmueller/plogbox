import React from 'react';
import {Button, Collapse, Grid, withStyles} from 'material-ui';
import ContentAdd from 'material-ui-icons/Add';
import PropTypes from 'prop-types';
import BlockComponent from './BlockComponent';
import RenderedBlock from '../containers/RenderedBlockContainer';
import { withPost } from '../common/withPost';

const floatingButtonStyle = {
  float: 'right',
  marginTop: '2.5em',
};

const RenderedPost = ({ post, isFetchingBlock, focusedBlockId }) => (
  <div>
    {
      post.blocks.map(block =>
        (
          <RenderedBlock
            key={block.id || block.tempid}
            postId={post.id}
            isFetchingBlock={isFetchingBlock}
            block={block}
            isFocused={
              (block.id === focusedBlockId || block.tempid === focusedBlockId)
              && focusedBlockId !== undefined
            }
          />
        ),
      )
    }
  </div>
);

RenderedPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        dialect: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
  isFetchingBlock: PropTypes.bool.isRequired,
  focusedBlockId: PropTypes.number,
};

const BlockEditors = (
  {
    post,
    handleSetBlocks,
    handleAddBlock,
    focusedBlockId,
    onFocus,
    onBlur,
  }) =>
  (
    <div>
      {
        post.blocks.map((block, index) =>
          (
            <BlockComponent
              key={block.id || block.tempid}
              postId={post.id}
              block={block}
              blocks={post.blocks}
              blockIndex={index}
              onFocus={() => onFocus(block)}
              onBlur={onBlur}
              isFocused={(
                block.id === focusedBlockId
                || block.tempid === focusedBlockId
              ) && focusedBlockId !== undefined}
              handleSetBlocks={handleSetBlocks}
            />
          ),
        )
      }
      <Button
        fab
        onClick={() => handleAddBlock()}
        color="primary"
        style={floatingButtonStyle}
      >
        <ContentAdd />
      </Button>
    </div>
  );

BlockEditors.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        dialect: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
  focusedBlockId: PropTypes.number,
  handleSetBlocks: PropTypes.func.isRequired,
  handleAddBlock: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

const styles = theme => ({
  editorButton: {
    display: 'none',
    flip: false,
    left: theme.spacing.unit,
    [theme.breakpoints.up('sm')]: {
      display: 'inline',
    },
  },
  viewButton: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline',
      flip: false,
      left: theme.spacing.unit * 2,
    },
  },
  sideBySideButton: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline',
      flip: false,
      left: theme.spacing.unit * 3,
    },
  },
});

export class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      focusedBlockId: undefined,
    };
  }

  render() {
    const { post, handleSetBlocks, isFetchingBlock, handleAddBlock } = this.props;
    const {
      showEditor,
      showRenderedView,
      showBoth,
    } = this.props;

    if (post === undefined) {
      return <div>No post!</div>;
    }

    return (
      <div>
        <Collapse in={showEditor} unmountOnExit>
          <BlockEditors
            post={post}
            handleSetBlocks={handleSetBlocks}
            handleAddBlock={handleAddBlock}
            onFocus={block => this.setState({ focusedBlockId: block.id || block.tempid })}
            onBlur={() => this.setState({ focusedBlockId: undefined })}
            focusedBlockId={this.state.focusedBlockId}
          />
        </Collapse>

        <Collapse in={showRenderedView} unmountOnExit>
          <RenderedPost
            post={post}
            blocks={post.blocks}
            isFetchingBlock={isFetchingBlock}
            focusedBlockId={this.state.focusedBlockId}
          />
        </Collapse>

        <Collapse in={showBoth} unmountOnExit>
          <Grid container spacing={16}>
            <Grid item xs={5} style={{ paddingBottom: '1.5em', paddingLeft: '1em' }}>
              <BlockEditors
                post={post}
                handleSetBlocks={handleSetBlocks}
                handleAddBlock={handleAddBlock}
                onFocus={block => this.setState({ focusedBlockId: block.id || block.tempid })}
                onBlur={() => this.setState({ focusedBlockId: undefined })}
                focusedBlockId={this.state.focusedBlockId}
              />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={6}>
              <RenderedPost
                post={post}
                blocks={post.blocks}
                isFetchingBlock={isFetchingBlock}
                focusedBlockId={this.state.focusedBlockId}
              />
            </Grid>
          </Grid>
        </Collapse>
      </div>
    );
  }
}

Editor.propTypes = {
  showEditor: PropTypes.bool,
  showRenderedView: PropTypes.bool,
  showBoth: PropTypes.bool,
  post: PropTypes.shape({
    id: PropTypes.number,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        dialect: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
  isFetchingBlock: PropTypes.bool,
  handleSetBlocks: PropTypes.func.isRequired,
  handleAddBlock: PropTypes.func.isRequired,
};

Editor.defaultProps = {
  showEditor: false,
  showRenderedView: false,
  showBoth: true,
};

export default withPost(withStyles(styles)(Editor));
