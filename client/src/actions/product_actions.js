import {
  PRODUCT_DETAILS,
  PRODUCT_LIST,
  POST_REVIEW,
  DELETE_REVIEW,
  UPDATE_LIKES,
  ADD_PRODUCT,
  USER_PRODUCT_LIST,
  EDIT_PRODUCT,
} from "../ACTION_TYPES";
import axios from "axios";

const PRESET = "b2meImages";
const CLOUD_URL = "https://api.cloudinary.com/v1_1/b2me/image/upload";

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

async function uploadImages(imageSource) {
  let imageUrl = [];

  const cloudinaryImages = async () => {
    const promises = imageSource.map(async (source) => {
      let data = new FormData();
      data.append("file", source);
      data.append("upload_preset", PRESET);
      await axios
        .post(CLOUD_URL, data)
        .then(
          (response) => (imageUrl = [...imageUrl, response.data.secure_url])
        );
    });
    await Promise.all(promises);
  };

  await cloudinaryImages();

  return imageUrl;
}

export async function addProduct(productDetails, productImages) {
  let imageURLs = await uploadImages(productImages);

  productDetails = { ...productDetails, imageURLs };

  const request = await axios
    .post("/api/product/add", { ...productDetails })
    .then((response) => {
      return response.data;
    });

  return {
    type: ADD_PRODUCT,
    payload: request,
  };
}

export async function editProduct(productDetails, productImages, id) {
  let imageURLs = await uploadImages(productImages);
  productDetails = { ...productDetails, imageURLs };

  const request = await axios
    .post(`/api/product/edit?id=${id}`, { ...productDetails })
    .then((response) => response.data);

  return {
    type: EDIT_PRODUCT,
    payload: request,
  };
}

export async function userProductList() {
  const request = await axios
    .get("/api/product/user-product-list")
    .then((response) => response.data);

  return {
    type: USER_PRODUCT_LIST,
    payload: request,
  };
}

export async function deleteProducts(products) {
  let idsToRemove = [];
  products.forEach((product) => idsToRemove.push(product._id));

  const deleteRequest = await axios
    .post("/api/product/delete", { idsToRemove: [...idsToRemove] })
    .then((response) => response.data);
  const newProducts = await axios
    .get("/api/product/user-product-list")
    .then((response) => response.data);

  return {
    type: USER_PRODUCT_LIST,
    payload: { ...deleteRequest, ...newProducts },
  };
}
