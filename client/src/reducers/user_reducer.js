import { USER_AUTH, LOGOUT, SIGNUP, LOGIN } from "../ACTION_TYPES";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case USER_AUTH:
      return { ...state, user: payload };
    case LOGOUT:
      return { ...state, user: payload };
    case SIGNUP:
      return { ...state, user: payload };
    case LOGIN:
      return { ...state, user: payload };
    default:
      return state;
  }
};
