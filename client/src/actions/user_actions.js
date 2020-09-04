import axios from "axios";
import { USER_AUTH, LOGOUT, SIGNUP, LOGIN } from "../ACTION_TYPES";

export async function auth() {
  const request = await axios.get("/api/auth").then((response) => {
    return response.data;
  });

  return {
    type: USER_AUTH,
    payload: request,
  };
}

export async function logout() {
  const request = await axios.get("/api/user/logout").then((response) => {
    return response.data;
  });

  return {
    type: LOGOUT,
    payload: request,
  };
}

export async function signUp(userdata) {
  const request = await axios
    .post("/api/user/register", userdata)
    .then((response) => {
      return response.data;
    });

  return {
    type: SIGNUP,
    payload: request,
  };
}

export async function login(userdata) {
  const request = await axios
    .post("/api/user/login", userdata)
    .then((response) => {
      return response.data;
    });

  return {
    type: LOGIN,
    payload: request,
  };
}
