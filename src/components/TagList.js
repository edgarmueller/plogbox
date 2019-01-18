import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import { connect } from 'react-redux';
import * as actions from '../actions';
import NewTagDialog from './NewTagDialog';
import DeleteTagDialog from './DeleteTagDialog';
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import RenameTagDialog from "./RenameTagDialog";
import Fab from "@material-ui/core/Fab/Fab";
import Hovered from "./Hovered";

const styles = {
  fab: {
    float: 'right',
    margin: 10
  },
};

class TagList extends React.Component {
  state = {
    openNewTagDialog: false,
    openDeleteTagDialog: false
  };

  componentDidMount() {
    this.props.fetchTags();
  }

  render() {
    const { classes, onSelect, tags } = this.props;
    return (
      <div>
        <List>
          {
            _.isEmpty(tags) ?
              <div>No tags found</div>
              : tags.map(tag => (
                <Hovered key={tag}>
                  {
                    isHovered => {
                      return (
                        <ListItem
                          key={tag}
                          button
                          onClick={() => onSelect(tag)}
                        >
                          <ListItemText primary={tag}/>
                          <ListItemSecondaryAction style={{ visibility: isHovered ? 'inherit' : 'hidden' }}>
                            <IconButton aria-label="Rename" onClick={() => {
                              this.setState({
                                openRenameTagDialog: true,
                                tagToRename: tag
                              })
                            }}>
                              <CreateIcon/>
                            </IconButton>
                            <IconButton aria-label="Delete" onClick={() => {
                              this.setState({
                                openDeleteTagDialog: true,
                                tagToDelete: tag
                              })
                            }}>
                              <DeleteIcon/>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )
                    }
                  }
                </Hovered>
              ))
          }
        </List>
        <NewTagDialog
          open={this.state.openNewTagDialog}
          handleClose={() => this.setState({ openNewTagDialog: false })}
        />
        {
          this.state.tagToDelete &&
          <DeleteTagDialog
            open={this.state.openDeleteTagDialog}
            tag={this.state.tagToDelete}
            handleClose={() => this.setState({openDeleteTagDialog: false})}
          />
        }
        {
          this.state.tagToRename &&
          <RenameTagDialog
            open={this.state.openRenameTagDialog}
            tag={this.state.tagToRename}
            handleClose={() => this.setState({openRenameTagDialog: false})}
          />
        }
        <Fab
          color="primary"
          className={classes.fab}
          onClick={() => this.setState({ openNewTagDialog: true })}
        >
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

TagList.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onSelect: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  fetchTags: PropTypes.func.isRequired,
};

TagList.defaultProps = {
  tags: [],
};

const mapStateToProps = state => ({
  tags: state.tags.tags,
});

const mapDispatchToProps = dispatch => ({
  fetchTags() {
    dispatch(actions.fetchTags());
  }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TagList));
