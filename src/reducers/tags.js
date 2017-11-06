import { ADD_TAG_SUCCESS, SET_TAGS } from '../constants/index';

export const tags = (state = [], action) => {
  switch (action.type) {
    case SET_TAGS:
      return action.tags;
    case ADD_TAG_SUCCESS: {
      const copy = state.slice();
      copy.push(action.tag.name);
      return copy;
    }
    default:
      return state;
  }
};

export default tags;
