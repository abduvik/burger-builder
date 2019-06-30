import React, { useEffect } from "react";
import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { fetchOrders } from "./../../store/actions/order.actions";
import { connect } from "react-redux";
import Spinner from "./../../components/Spinner/Spinner";

const Orders = props => {
  useEffect(() => {
    props.onFetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return props.loading ? (
    <Spinner />
  ) : (
    <div>
      {props.orders.map(order => (
        <Order
          key={order.id}
          ingredients={order.ingredients}
          price={+order.price}
        />
      ))}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: () => dispatch(fetchOrders())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Orders, axios));
