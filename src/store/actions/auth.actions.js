import { AUTH_START, AUTH_SUCCESS, AUTH_FAILED, AUTH_LOGOUT } from "./actionTypes";
import axios from "axios";

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

export const logout = payload => ({
  type: AUTH_LOGOUT
});

export const checkAuthTimeout = expirtationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirtationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let url = "";
    if (isSignUp) {
      url =
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBW8U_habY3W4rgS7z6KiChuiX5oaHzeAA";
    } else {
      url =
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBW8U_habY3W4rgS7z6KiChuiX5oaHzeAA";
    }

    axios
      .post(url, authData)
      .then(response => {
        console.log(response);
        dispatch(authSuccess(response.data));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(error => dispatch(authFailed(error)));
  };
};
