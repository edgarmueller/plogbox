import { ADD_TAG_SUCCESS, FETCH_TAGS_SUCCESS, FETCH_TAGS_FAILURE } from '../constants/index';

export const tags = (state = {
  tags: [],
  error: undefined,
}, action) => {
  switch (action.type) {
    case FETCH_TAGS_SUCCESS:
      return {
        tags: action.tags,
        error: undefined,
      };
    case FETCH_TAGS_FAILURE:
      return {
        tags: [],
        error: action.error,
      };
    case ADD_TAG_SUCCESS: {
      const copy = state.slice();
      if (copy.indexOf(action.tag.name) === -1) {
        copy.push(action.tag.name);
      }
      return copy;
    }
    default:
      return state;
  }
};

export default tags;
