import { PRODUCT_LIST } from "../ACTION_TYPES";
import axios from "axios";

export async function productList() {
  const request = await axios
    .get("/api/product/product-list")
    .then((response) => {
      return response.data;
    });

  return {
    type: PRODUCT_LIST,
    payload: request,
  };
}
