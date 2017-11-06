import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Chip, MenuItem } from 'material-ui';
import { blue300 } from 'material-ui/styles/colors';

export const Tag = ({ post, isEditingTags, addTag, removeTag, setSelection, suggestedTags }) => {
  if (isEditingTags) {
    // TODO: can we keep the tag ID?
    const menuItems = suggestedTags.map(tag => ({
      text: tag,
      value: (
        <MenuItem
          primaryText={tag}
          secondaryText="&#9786;"
        />
      ),
    }));

    return (
      <AutoComplete
        hintText="Add tags..."
        dataSource={menuItems}
        autoFocus
        onNewRequest={(tag) => {
          if (typeof tag === 'string') {
            addTag(post, tag);
          } else {
            addTag(post, tag.text);
          }
          setSelection(false, -1, -1);
        }}
      />
    );
  }

  return (
    <span>
      {
        (post.tags || []).map(tag =>
            (
              <Chip
                key={tag.name}
                backgroundColor={tag.color ? `#${tag.color}` : blue300}
                onRequestDelete={() => {
                  removeTag(post, tag);
                  setSelection(true, -1, -1);
                }}
              >
                {tag.name}
              </Chip>
            ),
        )
      }
    </span>
  );
};

Tag.propTypes = {
  isEditingTags: PropTypes.bool,
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
  setSelection: PropTypes.func.isRequired,
  suggestedTags: PropTypes.arrayOf(PropTypes.string),
};

Tag.defaultProps = {
  isEditingTags: false,
  suggestedTags: [],
};

export default Tag;
