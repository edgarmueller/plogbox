import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, withStyles } from 'material-ui';
import BlockEditors from './BlockEditors';
import RenderedPost from './RenderedPost';
import EditPostButtonBarContainer from '../containers/EditPostButtonBarContainer';


const styles = {
  whiteBackground: {
    paddingLeft: '1em',
    paddingBottom: '1em',
    backgroundColor: '#fff',
    borderRadius: '0.25em',
    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
  },
};

class EditComponent extends React.Component {
  render() {
    const {
      classes,
      // focusedBlockId,
      // handleSetBlocks,
      // handleAddBlock,
      // handleUpdateFocusedBlock,
      // handleFocusLoss,
      // isFetchingBlock,
      text,
      showBoth,
      showEditor,
      showRenderedView,
    } = this.props;

    if (text === undefined) {
      return <div>Please select a post first</div>;
    }

    return (
      <div style={{ minHeight: '100%', backgroundColor: '#fff' }}>
        <EditPostButtonBarContainer post={post} />
        <Collapse in={showEditor} unmountOnExit>
          <div className={classes.whiteBackground}>
            <BlockEditors
              post={post}
              // handleSetBlocks={handleSetBlocks}
              // handleAddBlock={handleAddBlock}
              // onFocus={handleUpdateFocusedBlock}
              // onBlur={handleFocusLoss}
              // focusedBlockId={focusedBlockId}
            />
          </div>
        </Collapse>

        <Collapse in={showRenderedView} unmountOnExit>
          <div style={{ margin: 'auto', width: '70%' }} className={classes.whiteBackground}>
            <RenderedPost
              post={post}
              blocks={post.blocks}
              isFetchingBlock={isFetchingBlock}
              focusedBlockId={focusedBlockId !== undefined ? focusedBlockId.toString() : undefined}
            />
          </div>
        </Collapse>

        <Collapse in={showBoth} unmountOnExit>
          <div className={classes.whiteBackground} >
            <BlockEditors
              post={post}
              handleSetBlocks={handleSetBlocks}
              handleAddBlock={handleAddBlock}
              onFocus={handleUpdateFocusedBlock}
              onBlur={handleFocusLoss}
              focusedBlockId={focusedBlockId}
            />
          </div>
        </Collapse>
      </div>
    );
  }
}

EditComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  // focusedBlockId: PropTypes.number.isRequired,
  // handleSetBlocks: PropTypes.func.isRequired,
  // handleAddBlock: PropTypes.func.isRequired,
  // handleUpdateFocusedBlock: PropTypes.func.isRequired,
  // handleFocusLoss: PropTypes.func.isRequired,
  // isLoading: PropTypes.bool.isRequired,
  text: PropTypes.object.isRequired,
  showBoth: PropTypes.bool.isRequired,
  showEditor: PropTypes.bool.isRequired,
  showRenderedView: PropTypes.bool.isRequired,
};

EditComponent.defaultProps = {

};

export default withStyles(styles)(EditComponent);
