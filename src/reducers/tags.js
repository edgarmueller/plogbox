import {ADD_TAG_SUCCESS, FETCH_TAGS_SUCCESS, FETCH_TAGS_FAILURE, AUTH_LOGOUT} from '../constants/index';

const initState = {
  tags: [],
  error: undefined,
}

export const tags = (state = initState, action) => {
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
    case AUTH_LOGOUT:
      return initState;
    default:
      return state;
  }
};

export default tags;
