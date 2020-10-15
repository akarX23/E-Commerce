import { ADD_ORDER, CLEAR_ORDER_ACTION, GET_ORDERS } from "../ACTION_TYPES";

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
    case GET_ORDERS: {
      return { ...state, orders: payload };
    }
    default:
      return state;
  }
};
