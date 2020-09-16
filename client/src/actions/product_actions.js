import { PRODUCT_LIST } from "../ACTION_TYPES";
import axios from "axios";

export async function productList(
  searchArray = [],
  rating,
  priceRange,
  sortby,
  order = "desc",
  limit = 6,
  skip = 0,
  list = ""
) {
  const request = await axios
    .post("/api/product/product-list", {
      searchArray,
      rating,
      priceRange,
      sortby,
      limit,
      skip,
      order,
    })
    .then((response) => {
      if (list) response.data.products = [...list, ...response.data.products];
      return response.data;
    });

  return {
    type: PRODUCT_LIST,
    payload: request,
  };
}

export async function allProductList() {
  const request = await axios.get("/api/product/all").then((response) => {
    return response.data;
  });

  return {
    type: PRODUCT_LIST,
    payload: request,
  };
}
