import axios from "axios";
import { USER_AUTH } from "../ACTION_TYPES";

export async function auth() {
  const request = await axios.get("/api/auth").then((response) => {
    return response.data;
  });

  return {
    type: USER_AUTH,
    payload: request,
  };
}
