import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, List, ListItem, withStyles } from 'material-ui';
import AddIcon from 'material-ui-icons/Add';
import * as actions from '../actions';
import NewTagDialog from './NewTagDialog';
import {connect} from "react-redux";

const styles = {
  fab: {
    float: 'right',
  },
};

class TagList extends React.Component {
  state = {
    open: false,
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
                <ListItem
                  button
                  onClick={() => onSelect(tag)}
                >
                  {tag}
                </ListItem>
              ))
          }
        </List>
        <NewTagDialog
          open={this.state.open}
          handleClose={() => this.setState({ open: false })}
        />
        <Button
          variant="fab"
          color="primary"
          className={classes.fab}
          onClick={() => this.setState({ open: true })}
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
