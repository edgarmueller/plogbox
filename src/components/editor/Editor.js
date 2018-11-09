import React from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import { Edit, Slideshow, ViewColumn as VerticalSplit } from 'material-ui-icons';
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


const ToolBar = ({ isSaving }) => (
  <div style={{ display: 'flex', flexDirection: 'column', padding: '1em' }}>
    <IconButton onClick={this.handleClickShowEditorView}>
      <Edit />
    </IconButton>
    <IconButton onClick={this.handleClickShowRenderedView}>
      <Slideshow />
    </IconButton>
    <IconButton onClick={this.handleClickShowBoth}>
      <VerticalSplit />
    </IconButton>
    {
      isSaving ? 'Saving...' : null
    }
  </div>
);

ToolBar.propTypes = {
  isSaving: PropTypes.bool
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
  classes, displayMode, handleOnChange, isLoading, isSaving, post, text
}) => {

  if (post === undefined) {
    return (<NoPost />);
  }

  if (displayMode === 'view') {
    return (
      <EditorLayout>
        <ToolBar />
        <div className={classes.singlePane}>
          <RenderedView text={text} />
        </div>
      </EditorLayout>
    );
  } else if (displayMode === 'both') {
    return (
      <EditorLayout>
        <ToolBar isSaving={isSaving} />
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
      <ToolBar isSaving={isSaving} />
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
  classes: PropTypes.object.isRequired,
  displayMode: PropTypes.oneOf(['editor', 'view', 'both']).isRequired,
  handleOnChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  post: PropTypes.object,
  text: PropTypes.string.isRequired
};


export default withStyles(styles)(Editor);
