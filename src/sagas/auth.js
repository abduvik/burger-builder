import { put, takeEvery, delay } from "@redux-saga/core/effects";
import {
  AUTH_INITIATE_LOGOUT,
  AUTH_CHECK_TIMEOUT,
  AUTH_USER,
  AUTH_CHECK_STATE
} from "./../store/actions/actionTypes";
import {
  authLogout,
  authStart,
  authSuccess,
  checkAuthTimeout,
  authFailed
} from "../store/actions/auth.actions";
import { logout } from "./../store/actions/auth.actions";
import axios from "axios";

export function* logoutSaga(action) {
  yield localStorage.removeItem("token");
  yield localStorage.removeItem("expirationDate");
  yield localStorage.removeItem("userId");

  yield put(authLogout());
}

export function* checkAuthTimoutSaga(action) {
  yield delay(action.payload.expirtationTime * 1000);
  yield put(logout());
}

export function* authUserSaga(action) {
  yield put(authStart());

  const authData = {
    email: action.payload.email,
    password: action.payload.password,
    returnSecureToken: true
  };

  let url = "";
  if (action.payload.isSignUp) {
    url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBW8U_habY3W4rgS7z6KiChuiX5oaHzeAA";
  } else {
    url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBW8U_habY3W4rgS7z6KiChuiX5oaHzeAA";
  }

  try {
    const response = yield axios.post(url, authData);

    const expirtationDate = new Date(
      new Date().getTime() + response.data.expiresIn * 1000
    );

    localStorage.setItem("token", response.data.idToken);
    localStorage.setItem("expirationDate", expirtationDate);
    localStorage.setItem("userId", response.data.localId);
    yield put(authSuccess(response.data));
    yield put(checkAuthTimeout(response.data.expiresIn));
  } catch (error) {
    yield put(authFailed(error));
  }
}

export function* authCheckStateSaga(action) {
  const token = localStorage.getItem("token");

  if (!token) {
    yield put(logout());
  } else {
    const expirationDate = new Date(localStorage.getItem("expirationDate"));
    if (expirationDate < new Date()) {
      yield put(logout());
    } else {
      const userId = localStorage.getItem("userId");
      yield put(authSuccess({ idToken: token, localId: userId }));
      yield put(checkAuthTimeout((expirationDate - new Date()) / 1000));
    }
  }
}

export function* watchAuth() {
  yield takeEvery(AUTH_INITIATE_LOGOUT, logoutSaga);
  yield takeEvery(AUTH_CHECK_TIMEOUT, checkAuthTimoutSaga);
  yield takeEvery(AUTH_USER, authUserSaga);
  yield takeEvery(AUTH_CHECK_STATE, authCheckStateSaga);
}
