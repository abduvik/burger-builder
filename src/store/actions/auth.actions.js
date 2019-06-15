import { AUTH_START, AUTH_SUCCESS, AUTH_FAILED } from "./actionTypes";
import { axios } from 'axios';

export const authStart = () => ({
  type: AUTH_START
});

export const authSuccess = authData => ({
  type: AUTH_SUCCESS,
  payload: {
    authData
  }
});

export const authFailed = error => ({
  type: AUTH_FAILED,
  payload: {
    error
  }
});

export const auth = (email, password) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
        email: email,
        password: password,
        returnSecureToken: true
    }
    axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyBW8U_habY3W4rgS7z6KiChuiX5oaHzeAA', authData)
    .then(response => {
        console.log(response);
        dispatch(authSuccess(response.data))
    })
    .catch(error => dispatch(authFailed(error)))
  };
};
