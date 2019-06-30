import React from "react";
import { Route, Redirect } from "react-router-dom";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";

import { connect } from "react-redux";

const Checkout = props => {
  const checkoutCanceledHandler = () => {
    props.history.goBack();
  };
  const checkoutContinuedHandler = () => {
    props.history.replace("/checkout/contact-data");
  };

  return props.ingredients && !props.purchased ? (
    <div>
      <CheckoutSummary
        ingredients={props.ingredients}
        onCheckoutCanceled={checkoutCanceledHandler}
        onCheckoutContinued={checkoutContinuedHandler}
      />
      <Route
        path={props.match.path + "/contact-data"}
        render={props => (
          <ContactData
            {...props}
            ingredients={props.ingredients}
            price={props.totalPrice}
          />
        )}
      />
    </div>
  ) : (
    <Redirect to="/" />
  );
};

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    purchased: state.order.purchased
  };
};

export default connect(mapStateToProps)(Checkout);
