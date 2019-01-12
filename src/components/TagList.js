import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import * as actions from '../actions';
import NewTagDialog from './NewTagDialog';
import DeleteTagDialog from './DeleteTagDialog';
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';

const styles = {
  fab: {
    float: 'right',
    margin: 10
  },
};

class Hovered extends React.Component {
  state = {
    isHovered: false
  }

  onMouseEnter = () => {
    this.setState({ isHovered: true })
  }

  onMouseLeave = () => {
    this.setState({ isHovered: false })
  }

  render() {
    const { children } = this.props;
    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {children(this.state.isHovered)}
      </div>
    )
  }
}

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
                <Hovered>
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
        <DeleteTagDialog
          open={this.state.openDeleteTagDialog}
          tag={this.state.tagToDelete}
          handleClose={() => this.setState({ openDeleteTagDialog: false })}
        />
        <Button
          variant="fab"
          color="primary"
          className={classes.fab}
          onClick={() => this.setState({ openNewTagDialog: true })}
        >
          <AddIcon />
        </Button>
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
