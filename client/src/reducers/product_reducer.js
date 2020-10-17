import {
  PRODUCT_LIST,
  PRODUCT_DETAILS,
  POST_REVIEW,
  DELETE_REVIEW,
  UPDATE_LIKES,
  ADD_PRODUCT,
  USER_PRODUCT_LIST,
  EDIT_PRODUCT,
  CLEAR_REVIEW_ACTIONS,
  CLEAR_PRODUCT,
} from "../ACTION_TYPES";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case PRODUCT_LIST:
      return { ...state, list: payload };
    case PRODUCT_DETAILS:
      return { ...state, product: payload };
    case POST_REVIEW: {
      if (payload.reviewAdded === true)
        return {
          ...state,
          review: payload,
          product: { ...state.product, product: { ...payload.product } },
        };
      else return { ...state, review: payload };
    }
    case DELETE_REVIEW: {
      if (payload.deleted === true)
        return {
          ...state,
          review: payload,
          product: { ...state.product, product: { ...payload.product } },
        };
      else return { ...state, review: payload };
    }

    case UPDATE_LIKES: {
      if (payload.updateLikes === true)
        return {
          ...state,
          review: payload,
          product: { ...state.product, product: { ...payload.product } },
        };
      else return { ...state, review: payload };
    }
    case CLEAR_REVIEW_ACTIONS:
      return { ...state, review: null };
    case ADD_PRODUCT:
      return { ...state, productAdd: payload };
    case USER_PRODUCT_LIST:
      return { ...state, userProducts: payload };
    case EDIT_PRODUCT:
      return { ...state, product: { ...payload, found: true } };
    case CLEAR_PRODUCT:
      return { ...state, product: null };
    default:
      return state;
  }
};
