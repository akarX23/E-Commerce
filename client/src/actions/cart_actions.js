import axios from "axios";
import { CART_PRODUCT_LIST, CART_ACTION } from "../ACTION_TYPES";

export async function cartProductList() {
  const request = await axios
    .get("/api/cart/items")
    .then((response) => response.data);

  return {
    type: CART_PRODUCT_LIST,
    payload: request,
  };
}

export async function addCartItem(id, price, quantity) {
  const request = await axios
    .post("/api/cart/add-item", {
      id,
      price,
      quantity,
    })
    .then((response) => response.data);

  return {
    type: CART_ACTION,
    payload: request,
  };
}

export async function changeQuantity(id, price, quantity) {
  const request = await axios
    .post("/api/cart/changeQuantity", {
      id,
      price,
      quantity,
    })
    .then((response) => response.data);

  return {
    type: CART_ACTION,
    payload: request,
  };
}

export async function deleteItem(id) {
  const request = await axios
    .delete(`/api/cart/delete-item?id=${id}`)
    .then((response) => response.data);

  return {
    type: CART_ACTION,
    payload: request,
  };
}
