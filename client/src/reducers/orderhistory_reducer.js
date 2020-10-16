import {
  ADD_ORDER,
  CLEAR_ORDER_ACTION,
  GET_ORDERS,
  GET_HISTORY_ITEM,
} from "../ACTION_TYPES";

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
    case GET_HISTORY_ITEM: {
      return { ...state, historyItem: payload };
    }
    default:
      return state;
  }
};
