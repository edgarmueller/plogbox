import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, IconButton, MenuItem, Toolbar, withStyles } from 'material-ui';
import { Edit, Slideshow, ViewColumn as VerticalSplit } from 'material-ui-icons';
import debouncedPromise from 'awesome-debounce-promise';
import {
  getIsUpdatingPost,
  getPostErrorMessage,
  getSelectedPost,
} from '../reducers';
import withDragDropContext from '../common/withDragDropContext';
import { fetchFile, pushFile } from '../api/dropbox';
import Editor from '../components/Editor';
import RenderedView from '../components/RenderedView';
import { center } from '../common/styles';

const saveFile = debouncedPromise(pushFile, 1000);

const styles = {
  center
};

const NoPosts = withStyles(styles)(({ classes }) => (
  <div className={classes.center}>
    No post available
  </div>
));

export class EditorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRenderedView: false,
      isSaving: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post !== this.props.post && this.props.post !== undefined) {
      this.setState(
        { isLoading: true },
        () =>
          fetchFile(this.props.post.path_lower)
            .then((fileContent) => {
              this.setState({
                text: fileContent,
                isLoading: false
              });
            })
      );
    }
  }

  handleClickShowEditorView = () => {
    this.setState({
      showBoth: false,
      showRenderedView: false,
    });
  }

  handleClickShowRenderedView = () => {
    this.setState({
      showBoth: false,
      showRenderedView: true,
    });
  }

  handleClickShowBoth = () => {
    this.setState({
      showBoth: true,
      showRenderedView: false,
    });
  }

  handleOnChange = (post) => (changedText) => {
    this.setState(
      { isSaving: true },
      () =>
        saveFile(post.path_lower, changedText)
          .then(() => this.setState({ isSaving: false }))
    );
    this.setState({ text: changedText });
  }

  render() {
    const { post } = this.props;
    const {
      isLoading,
      showRenderedView,
      showBoth,
      text
    } = this.state;

    if (isLoading) {
      return (<div>Loading...</div>);
    }

    if (post === undefined) {
      return <NoPosts />;
    }

    const ToolBar = ({ isSaving }) => (
      <Toolbar style={{ paddingLeft: 0 }}>
        <MenuItem onClick={this.handleClickShowEditorView}>
          <IconButton>
            <Edit />
          </IconButton>
        </MenuItem>
        <MenuItem onClick={this.handleClickShowRenderedView}>
          <IconButton>
            <Slideshow />
          </IconButton>
        </MenuItem>
        <MenuItem onClick={this.handleClickShowBoth}>
          <IconButton>
            <VerticalSplit />
          </IconButton>
        </MenuItem>
        {
          isSaving ? 'Saving...' : null
        }
      </Toolbar>
    );

    if (showRenderedView) {
      return (
        <React.Fragment>
          <ToolBar />
          <RenderedView text={text} />
        </React.Fragment>
      );
    } else if (showBoth) {
      return (
        <React.Fragment>
          <ToolBar isSaving={this.state.isSaving} />
          <div style={{ paddingLeft: '2em', paddingRight: '2em' }}>
            <Grid container>
              <Grid item xs={6}>
                <Editor
                  post={post}
                  text={text}
                  width={'100%'}
                  onChange={this.handleOnChange(post)}
                />
              </Grid>
              <Grid item xs={6}>
                <RenderedView text={text} />
              </Grid>
            </Grid>
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <ToolBar isSaving={this.state.isSaving} />
        <div style={{ paddingLeft: '2em', paddingRight: '2em' }}>
          <Editor
            post={post}
            text={text}
            width={'75%'}
            onChange={this.handleOnChange(post)}
          />
        </div>
      </React.Fragment>
    );
  }
}


EditorContainer.propTypes = {
  post: PropTypes.object,
};

EditorContainer.defaultProps = {
  post: undefined,
};

export const mapStateToProps = state => ({
  post: getSelectedPost(state),
  userId: state.auth.userId,
  isUpdatingPost: getIsUpdatingPost(state),
  errorMessage: getPostErrorMessage(state),
});

export default connect(
  mapStateToProps,
  null,
)(withDragDropContext(EditorContainer));
