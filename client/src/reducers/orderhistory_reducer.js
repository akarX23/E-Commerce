import { ADD_ORDER, CLEAR_ORDER_ACTION } from "../ACTION_TYPES";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case ADD_ORDER: {
      return {
        ...state,
        orderAdded: { ...payload },
      };
    }
    case CLEAR_ORDER_ACTION: {
      return {
        ...state,
        orderAdded: null,
      };
    }
    default:
      return state;
  }
};
