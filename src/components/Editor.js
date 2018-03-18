import React from 'react';
import { Button, Collapse, Grid, withStyles } from 'material-ui';
import ContentAdd from 'material-ui-icons/Add';
import PropTypes from 'prop-types';
import BlockComponent from './BlockComponent';
import { withPost } from '../common/withPost';
import RenderedPost from './RenderedPost';

const floatingButtonStyle = {
  float: 'right',
  color: '#333435',
  backgroundColor: '#fff',
  marginTop: '1.5em',
  marginBottom: '1em',
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
        post.blocks.length > 0 ?
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
          ) : <p style={{ paddingTop: '1em' }}>No blocks created yet.</p>
      }
      <Button
        variant="fab"
        mini
        onClick={() => handleAddBlock()}
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
  focusedBlockId: PropTypes.string,
  handleSetBlocks: PropTypes.func.isRequired,
  handleAddBlock: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

BlockEditors.defaultProps = {
  focusedBlockId: undefined,
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
  whiteBackground: {
    paddingBottom: '1.5em',
    paddingLeft: '1em',
    backgroundColor: '#fff',
    borderRadius: '0.25em',
    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
  }
});

export class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      focusedBlockId: undefined,
    };
  }

  render() {
    const {
      classes, 
      post, 
      handleSetBlocks, 
      isFetchingBlock, 
      handleAddBlock,
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
          <div style={{ margin: 'auto', width: '70%' }} className={classes.whiteBackground}>
            <BlockEditors
              post={post}
              handleSetBlocks={handleSetBlocks}
              handleAddBlock={handleAddBlock}
              onFocus={block => this.setState({ focusedBlockId: block.id || block.tempid })}
              onBlur={() => this.setState({ focusedBlockId: undefined })}
              focusedBlockId={this.state.focusedBlockId}
            />
          </div>
        </Collapse>

        <Collapse in={showRenderedView} unmountOnExit>
          <div style={{ margin: 'auto', width: '70%' }} className={classes.whiteBackground}>
            <RenderedPost
              post={post}
              blocks={post.blocks}
              isFetchingBlock={isFetchingBlock}
              focusedBlockId={this.state.focusedBlockId !== undefined ? this.state.focusedBlockId.toString() : undefined}
            />
          </div>
        </Collapse>

        <Collapse in={showBoth} unmountOnExit>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <div className={classes.whiteBackground} >
                <BlockEditors
                  post={post}
                  handleSetBlocks={handleSetBlocks}
                  handleAddBlock={handleAddBlock}
                  onFocus={block => this.setState({ focusedBlockId: block.id || block.tempid })}
                  onBlur={() => this.setState({ focusedBlockId: undefined })}
                  focusedBlockId={this.state.focusedBlockId}
                />
              </div>
            </Grid>
            <Grid item xs={6} style={{ paddingRight: '1em' }}>
              <div className={classes.whiteBackground}>
                <RenderedPost
                  post={post}
                  blocks={post.blocks}
                  isFetchingBlock={isFetchingBlock}
                  focusedBlockId={this.state.focusedBlockId}
                />
              </div>
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
  isFetchingBlock: false,
};

export default withPost(withStyles(styles)(Editor));
