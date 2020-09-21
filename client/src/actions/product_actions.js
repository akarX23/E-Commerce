import {
  PRODUCT_DETAILS,
  PRODUCT_LIST,
  POST_REVIEW,
  DELETE_REVIEW,
  UPDATE_LIKES,
} from "../ACTION_TYPES";
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

export async function getProductDetails(id) {
  const request = await axios.get(`/api/product?id=${id}`).then((response) => {
    return response.data;
  });

  return {
    type: PRODUCT_DETAILS,
    payload: request,
  };
}

export async function postReview(id, rating, comment) {
  const request = await axios
    .post(`/api/product/review?id=${id}`, { rating, comment })
    .then((response) => {
      return response.data;
    });

  return {
    type: POST_REVIEW,
    payload: request,
  };
}

export async function deleteReview(id) {
  const request = await axios
    .delete(`/api/product/deleteReview?id=${id}`)
    .then((response) => {
      return response.data;
    });

  return {
    type: DELETE_REVIEW,
    payload: request,
  };
}

export async function updateLikes(liked, disliked, ownerId, id) {
  const request = await axios
    .post(`/api/product/reviewUpdateLikes?id=${id}`, {
      liked,
      disliked,
      ownerId,
    })
    .then((response) => {
      return response.data;
    });

  return {
    type: UPDATE_LIKES,
    payload: request,
  };
}
