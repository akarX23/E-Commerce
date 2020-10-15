import axios from "axios";
import { ADD_ORDER, CLEAR_ORDER_ACTION, GET_ORDERS } from "../ACTION_TYPES";

export async function addOrderHistory(paymentID, orderID, address) {
  const request = await axios
    .post("/api/orderHistory/add", { paymentID, orderID, address })
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

export async function getOrderHistory() {
  const request = await axios
    .get("/api/orderHistory/history")
    .then((response) => response.data);

  return {
    type: GET_ORDERS,
    payload: request,
  };
}
