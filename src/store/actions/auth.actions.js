import { AUTH_START, AUTH_SUCCESS, AUTH_FAILED, AUTH_LOGOUT, SET_AUTH_REDIRECT_PATH } from "./actionTypes";
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

export const logout = payload => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  return {
    type: AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirtationTime => {
  console.log(expirtationTime)
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
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationDate", new Date(new Date().getTime() + response.data.expiresIn * 1000));
        localStorage.setItem("userId", response.data.localId);
        dispatch(authSuccess(response.data));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(error => dispatch(authFailed(error)));
  };
};

export const setAuthRedirectPath = path => ({
  type: SET_AUTH_REDIRECT_PATH,
  payload: {
    path
  }
});

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate < new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess({ idToken: token, localId: userId }));
        dispatch(checkAuthTimeout((expirationDate - new Date()) / 1000));
      }
    }
  };
};
