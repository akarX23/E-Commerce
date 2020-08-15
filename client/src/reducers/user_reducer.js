import { USER_AUTH } from "../ACTION_TYPES";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case USER_AUTH:
      return { ...state, user: payload };
    default:
      return state;
  }
};
