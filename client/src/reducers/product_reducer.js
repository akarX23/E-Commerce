import {
  PRODUCT_LIST,
  PRODUCT_DETAILS,
  POST_REVIEW,
  DELETE_REVIEW,
  UPDATE_LIKES,
  ADD_PRODUCT,
} from "../ACTION_TYPES";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case PRODUCT_LIST:
      return { ...state, list: payload };
    case PRODUCT_DETAILS:
      return { ...state, product: payload };
    case POST_REVIEW:
      return { ...state, review: payload };
    case DELETE_REVIEW:
      return { ...state, review: payload };
    case UPDATE_LIKES:
      return { ...state, review: payload };
    case ADD_PRODUCT:
      return { ...state, productAdd: payload };
    default:
      return state;
  }
};
