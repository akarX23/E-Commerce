import { CART_PRODUCT_LIST, CART_ACTION } from "../ACTION_TYPES";

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
    default:
      return state;
  }
};
