import { AUTH_START, AUTH_SUCCESS, AUTH_FAILED, AUTH_LOGOUT } from "../actions/actionTypes";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case AUTH_START:
      return { ...state, error: null, loading: true };
    case AUTH_SUCCESS:
      return {
        ...state,
        token: payload.idToken,
        userId: payload.userId,
        error: null,
        loading: false
      };
    case AUTH_FAILED:
      return { ...state, error: payload.error, loading: false };
    case AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        userId: null
      };
    default:
      return state;
  }
};
