import React from 'react';
import PropTypes from 'prop-types';
import { Chip, withStyles } from 'material-ui';
import Autocomplete from './Autocomplete';

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});

export const Tags = ({ post, isEditing, addTag, removeTag, done, suggestedTags, classes }) => {

  if (isEditing) {
    // TODO: can we keep the tag ID?
    const suggetsions = suggestedTags.map(tag => ({
      label: tag,
    }));

    return (
      <Autocomplete
        suggestions={suggetsions}
        placeholder={'Enter a tag..'}
        onSubmit={(tag) => {
          addTag(post.id, tag);
          done();
        }}
        onEscape={() => done()}
      />
    );
  }

  return (
    <div className={classes.row}>
      {
        (post.tags || []).map(tag =>
            (
              <Chip
                className={classes.chip}
                key={tag.name}
                label={tag.name}
                onDelete={() => {
                  removeTag(post.id, tag);
                  done();
                }}
              />
            ),
        )
      }
    </div>
  );
};

Tags.propTypes = {
  isEditing: PropTypes.bool,
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
  addTag: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  done: PropTypes.func.isRequired,
  suggestedTags: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.object.isRequired,
};

Tags.defaultProps = {
  isEditing: false,
  suggestedTags: [],
};

export default withStyles(styles)(Tags);
