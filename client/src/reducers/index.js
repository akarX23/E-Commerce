import { combineReducers } from "redux";
import orderhistory from "./orderhistory_reducer";
import user from "./user_reducer";
import product from "./product_reducer";
import cart from "./cart_reducer";

const rootreducers = combineReducers({
  orderhistory,
  user,
  cart,
  product,
});

export default rootreducers;
