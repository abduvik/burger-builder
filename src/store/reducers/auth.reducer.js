import { AUTH_START, AUTH_SUCCESS, AUTH_FAILED, AUTH_LOGOUT, SET_AUTH_REDIRECT_PATH } from "../actions/actionTypes";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: "/"
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
    case SET_AUTH_REDIRECT_PATH:
      return {
        ...state,
        authRedirectPath: payload.path
      };
    default:
      return state;
  }
};
