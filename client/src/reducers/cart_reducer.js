import {
  CART_PRODUCT_LIST,
  CART_ACTION,
  CLEAR_CART_ACTIONS,
  PAY_BILL,
  CLEAR_CART,
} from "../ACTION_TYPES";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case CART_PRODUCT_LIST:
      return { ...state, cartItems: payload };
    case CART_ACTION: {
      if (payload.success === true)
        return {
          ...state,
          cartItems: {
            ...state.cartItems,
            items: [...payload.items],
          },
          cartActions: { ...payload },
        };
      else return { ...state, cartActions: { ...payload } };
    }
    case CLEAR_CART_ACTIONS: {
      return { ...state, cartActions: null };
    }
    case PAY_BILL: {
      return { ...state, payment: { ...payload } };
    }
    case CLEAR_CART:
      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          items: [],
        },
        cartActions: null,
      };
    default:
      return state;
  }
};
