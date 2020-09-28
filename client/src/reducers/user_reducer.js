import {
  USER_AUTH,
  LOGOUT,
  SIGNUP,
  LOGIN,
  VERIFY_EMAIL,
  RESEND_EMAIL,
  UPDATE_USER,
  CLEAR_VERIFY,
} from "../ACTION_TYPES";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case USER_AUTH:
      return { ...state, user: payload };
    case LOGOUT:
      return { ...state, user: payload };
    case SIGNUP:
      return { ...state, user: payload, verification: { verified: false } };
    case LOGIN:
      return { ...state, user: payload, verification: { verified: false } };
    case VERIFY_EMAIL: {
      if (payload.changeAuth === true)
        return {
          ...state,
          verification: payload.verification,
          user: payload.user,
        };
      else return { ...state, verification: payload };
    }
    case RESEND_EMAIL:
      return { ...state, verification: payload };
    case UPDATE_USER: {
      if (payload.update === true)
        return { ...state, update: true, user: { ...payload.user } };
      else return { ...state, update: false };
    }
    case CLEAR_VERIFY:
      return { ...state, verification: null, update: null };
    default:
      return state;
  }
};
