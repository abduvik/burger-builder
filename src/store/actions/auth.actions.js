import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAILED,
  AUTH_LOGOUT,
  SET_AUTH_REDIRECT_PATH,
  AUTH_INITIATE_LOGOUT,
  AUTH_CHECK_TIMEOUT,
  AUTH_USER,
  AUTH_CHECK_STATE
} from "./actionTypes";

export const authStart = () => ({
  type: AUTH_START
});

export const authLogout = () => ({
  type: AUTH_LOGOUT
});

export const authSuccess = authData => ({
  type: AUTH_SUCCESS,
  payload: {
    idToken: authData.idToken,
    userId: authData.localId
  }
});

export const authFailed = error => ({
  type: AUTH_FAILED,
  payload: {
    error
  }
});

export const logout = payload => {
  // localStorage.removeItem("token");
  // localStorage.removeItem("expirationDate");
  // localStorage.removeItem("userId");
  return {
    type: AUTH_INITIATE_LOGOUT
  };
};

export const checkAuthTimeout = expirtationTime => {
  return {
    type: AUTH_CHECK_TIMEOUT,
    payload: {
      expirtationTime
    }
  };
};

export const auth = (email, password, isSignUp) => {
  return {
    type: AUTH_USER,
    payload: { email, password, isSignUp }
  };
};

export const setAuthRedirectPath = path => ({
  type: SET_AUTH_REDIRECT_PATH,
  payload: {
    path
  }
});

export const authCheckState = () => {
  return {
    type: AUTH_CHECK_STATE
  }
};
