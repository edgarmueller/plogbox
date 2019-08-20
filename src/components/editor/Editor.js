import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import {HotKeys} from "react-hotkeys";
import BounceLoader from 'react-spinners/BounceLoader'
import RenderedView from "../../components/RenderedView";
import { center } from "../../common/styles";
import AceEditor from "./AceEditor";
import NoPost from "./NoPost";
import ToolBar from "./Toolbar";

const styles = {
  center,
  editorLayout: {
    backgroundColor: "#e6e6e6",
    display: "flex",
    flexDirection: "row",
    padding: "1rem"
  },
  singlePane: {
    flexGrow: 1
  },
  bothPanes: {
    paddingRight: "2em",
    flexGrow: 1
  }
};

const EditorLayout = withStyles(styles)(({ classes, children }) => (
  <div className={classes.editorLayout}>{children}</div>
));


const LoadingGuard = ({ children, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <BounceLoader size={40}/>
        <p>Loading</p>
      </div>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

LoadingGuard.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const Editor = ({
                  classes,
                  displayMode,
                  handleOnChange,
                  isLoading,
                  isSaving,
                  post,
                  text,
                  toolbarHandlers
                }) => {

  if (post === undefined) {
    return <NoPost />;
  }

  const handlers = {
    SHOW_EDITOR: () => {
      toolbarHandlers.handleClickShowEditorView()
    },
    SHOW_RENDERED_VIEW: () => {
      toolbarHandlers.handleClickShowRenderedView()
    }
  };

  if (displayMode === "view") {
    return (
      <HotKeys handlers={handlers}>
        <EditorLayout>
          <div className={classes.singlePane}>
            <RenderedView text={text} />
          </div>
          <ToolBar toolbarHandlers={toolbarHandlers} />
        </EditorLayout>
      </HotKeys>
    );
  } else if (displayMode === "both") {
    return (
      <HotKeys handlers={handlers}>
        <EditorLayout>
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
          <ToolBar toolbarHandlers={toolbarHandlers} isSaving={isSaving} />
        </EditorLayout>
      </HotKeys>
    );
  }


  return (
    <HotKeys handlers={handlers}>
      <EditorLayout>
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
        <ToolBar toolbarHandlers={toolbarHandlers} isSaving={isSaving} />
      </EditorLayout>
    </HotKeys>
  );
};

Editor.propTypes = {
  toolbarHandlers: PropTypes.shape({
    handleClickShowBoth: PropTypes.func.isRequired,
    handleClickShowRenderedView: PropTypes.func.isRequired,
    handleClickShowEditorView: PropTypes.func.isRequired
  }).isRequired,
  classes: PropTypes.object.isRequired,
  displayMode: PropTypes.oneOf(["editor", "view", "both"]).isRequired,
  handleOnChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  post: PropTypes.object,
  text: PropTypes.string.isRequired
};

export default withStyles(styles)(Editor);
