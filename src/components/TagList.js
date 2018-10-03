import React from 'react';
import PropTypes from 'prop-types';
import { Button, List, ListItem, withStyles } from 'material-ui';
import AddIcon from 'material-ui-icons/Add';
import NewTagDialog from './NewTagDialog';

const styles = {
  fab: {
    float: 'right',
  },
};

class TagList extends React.Component {
  state = {
    open: false,
  };

  render() {
    const { classes, onSelect, tags } = this.props;
    return (
      <div>
        <List>
          <ListItem
            button
            onClick={() => onSelect('')}
          >
            default
          </ListItem>
          {
            tags.map(tag => (
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
  tags: PropTypes.arrayOf(PropTypes.string)
};

TagList.defaultProps = {
  tags: [],
};

export default withStyles(styles)(TagList);
