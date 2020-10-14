import axios from "axios";
import { ADD_ORDER, CLEAR_ORDER_ACTION } from "../ACTION_TYPES";

export async function addOrderHistory(paymentID, orderID) {
  const request = await axios
    .post("/api/orderHistory/add", { paymentID, orderID })
    .then((response) => response.data);
  console.log(request);

  return {
    type: ADD_ORDER,
    payload: request,
  };
}

export function clearOrderAction() {
  return {
    type: CLEAR_ORDER_ACTION,
  };
}
