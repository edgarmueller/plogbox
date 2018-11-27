import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import { Edit, Slideshow, ViewColumn as VerticalSplit } from '@material-ui/icons';
import RenderedView from '../../components/RenderedView';
import { center } from '../../common/styles';
import AceEditor from './AceEditor';
import NoPost from "./NoPost";

const styles = {
  center,
  editorLayout: {
    backgroundColor: '#e6e6e657',
    height: '100%',
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    display: 'flex'
  },
  singlePane: {
    width: '75%'
  },
  bothPanes: {
    paddingRight: '2em',
    flexGrow: 1
  }
};

const EditorLayout = withStyles(styles)(({ classes, children }) => (
  <div className={classes.editorLayout}>
    {children}
  </div>
));


const ToolBar = ({ isSaving, toolbarHandlers }) => (
  <div style={{ display: 'flex', flexDirection: 'column', padding: '1em' }}>
    <IconButton onClick={toolbarHandlers.handleClickShowEditorView}>
      <Edit />
    </IconButton>
    <IconButton onClick={toolbarHandlers.handleClickShowRenderedView}>
      <Slideshow />
    </IconButton>
    <IconButton onClick={toolbarHandlers.handleClickShowBoth}>
      <VerticalSplit />
    </IconButton>
    {
      isSaving ? 'Saving...' : null
    }
  </div>
);

ToolBar.propTypes = {
  isSaving: PropTypes.bool,
  toolbarHandlers: PropTypes.shape({
    handleClickShowBoth: PropTypes.func.isRequired,
    handleClickShowRendererView: PropTypes.func.isRequired,
    handleClickShowEditorView: PropTypes.func.isRequired
  }).isRequired,
};

ToolBar.defaultProps = {
  isSaving: false
};

const LoadingGuard = ({ children, isLoading }) => {
  if (isLoading) {
    return (<div>Loading</div>);
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

LoadingGuard.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const Editor = ({
  classes, displayMode, handleOnChange, isLoading, isSaving, post, text, toolbarHandlers
}) => {

  if (post === undefined) {
    return (<NoPost />);
  }

  if (displayMode === 'view') {
    return (
      <EditorLayout>
        <ToolBar toolbarHandlers={toolbarHandlers} />
        <div className={classes.singlePane}>
          <RenderedView text={text} />
        </div>
      </EditorLayout>
    );
  } else if (displayMode === 'both') {
    return (
      <EditorLayout>
        <ToolBar
          toolbarHandlers={toolbarHandlers}
          isSaving={isSaving}
        />
        <div className={classes.bothPanes}>
          <Grid container>
            <Grid item xs={6}>
              <AceEditor
                post={post}
                text={text}
                width="100%"
                onChange={handleOnChange(post)}
              />
            </Grid>
            <Grid item xs={6}>
              <RenderedView text={text} />
            </Grid>
          </Grid>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout>
      <ToolBar
        toolbarHandlers={toolbarHandlers}
        isSaving={isSaving}
      />
      <div className={classes.singlePane}>
        <LoadingGuard isLoading={isLoading}>
          <AceEditor
            post={post}
            text={text}
            width="100%"
            onChange={handleOnChange(post)}
          />
        </LoadingGuard>
      </div>
    </EditorLayout>
  );
};

Editor.propTypes = {
  toolbarHandlers: PropTypes.shape({
    handleClickShowBoth: PropTypes.func.isRequired,
    handleClickShowRendererView: PropTypes.func.isRequired,
    handleClickShowEditorView: PropTypes.func.isRequired
  }).isRequired,
  classes: PropTypes.object.isRequired,
  displayMode: PropTypes.oneOf(['editor', 'view', 'both']).isRequired,
  handleOnChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  post: PropTypes.object,
  text: PropTypes.string.isRequired
};


export default withStyles(styles)(Editor);