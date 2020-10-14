import axios from "axios";
import {
  CART_PRODUCT_LIST,
  CART_ACTION,
  CLEAR_CART_ACTIONS,
  PAY_BILL,
  CLEAR_CART,
} from "../ACTION_TYPES";

const RAZOR_PAY_TEST_KEY = "rzp_test_d3gIhUbFAEGwOd";

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

export function clearCartActions() {
  return {
    type: CLEAR_CART_ACTIONS,
    payload: null,
  };
}

export async function makePayment(name, lastname, email, mobile, totalAmount) {
  const orderUrl = `/api/order?amount=${totalAmount}`;
  const order = await axios.get(orderUrl).then((response) => response.data);

  const options = {
    key: RAZOR_PAY_TEST_KEY,
    name: "B2ME",
    description: "Cart payment",
    order_id: order.id,
    handler: async (response) => {
      try {
        const paymentId = response.razorpay_payment_id;
        const url = `/api/capture`;
        const captureResponse = await axios
          .post(url, {
            paymentId,
            amount: totalAmount,
          })
          .then((response) => response.data);

        console.log(captureResponse);
        return {
          type: PAY_BILL,
          payload: captureResponse,
        };
      } catch (err) {
        console.log(err);
        return {
          type: PAY_BILL,
          payload: { success: false },
        };
      }
    },
    prefill: {
      name: `${name} ${lastname}`,
      email: email,
      contact: mobile,
    },
    theme: {
      color: "#121212",
    },
  };
  const rzp1 = new window.Razorpay(options);
  rzp1.open();
}

export function clearCart() {
  return {
    type: CLEAR_CART,
  };
}
