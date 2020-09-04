import { PRODUCT_LIST } from "../ACTION_TYPES";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case PRODUCT_LIST:
      return { ...state, list: payload };
    default:
      return state;
  }
};
