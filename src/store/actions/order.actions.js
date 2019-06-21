import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const purchaseBurgerSuccess = (orderId, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    payload: {
      orderId: orderId,
      orderData: orderData
    }
  };
};

export const purchaseBurgerFailed = error => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAILED,
    payload: {
      error: error
    }
  };
};

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START
  };
};

export const purchaseBurger = orderData => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    axios
      .post("/orders.json", orderData)
      .then(response => {
        dispatch(purchaseBurgerSuccess(response.data.name, orderData));
      })
      .catch(error => dispatch(purchaseBurgerFailed(error)));
  };
};

export const purchaseInit = orderData => {
  return {
    type: actionTypes.PURCHASE_INIT
  };
};

export const fetchOrderSuccess = orders => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    payload: {
      orders: orders
    }
  };
};

export const fetchOrderFailed = error => {
  return {
    type: actionTypes.FETCH_ORDERS_FAILED,
    payload: {
      error: error
    }
  };
};

export const fetchOrderStart = orders => {
  return {
    type: actionTypes.FETCH_ORDERS_START,
    payload: {
      orders: orders
    }
  };
};

export const fetchOrders = () => {
  return (dispatch, getStore) => {
    dispatch(fetchOrderStart());
    const store = getStore();
    axios
      .get("/orders.json?auth="+store.auth.token)
      .then(res => {
        const fetechedOrders = [];
        for (let key in res.data) {
          fetechedOrders.push({
            ...res.data[key],
            id: key
          });
        }

        dispatch(fetchOrderSuccess(fetechedOrders));
      })
      .catch(error => {
        dispatch(fetchOrderFailed(error));
      });
  };
};
