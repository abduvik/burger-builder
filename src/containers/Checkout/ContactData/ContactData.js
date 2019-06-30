import React, { useState } from "react";
import Button from "../../../components/UI/Button/Button";
import axios from "../../../axios-orders";

import { connect } from "react-redux";

import classes from "./ContactData.module.css";
import Spinner from "../../../components/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { purchaseBurger } from "./../../../store/actions/order.actions";
import { FormData } from "./FormData";
import { checkValidity } from "../../../utils/checkValidity";

const ContactData = props => {
  const [orderForm, setOrderForm] = useState(FormData);
  const [formValidity, setFormValidity] = useState(false);

  const orderHandler = event => {
    event.preventDefault();
    const formData = {};
    for (const formElementIndentifier in orderForm) {
      formData[formElementIndentifier] =
        orderForm[formElementIndentifier].value;
    }

    const order = {
      ingredients: props.ingredients,
      totalPrice: props.totalPrice,
      orderData: formData,
      userId: props.userId
    };

    props.onOrderBurger(order);
  };

  const onChangedHandler = (event, inputIdentifier) => {
    const newValue = event.target.value;

    const newOrderForm = {
      ...orderForm,
      [inputIdentifier]: {
        ...orderForm[inputIdentifier],
        value: newValue,
        valid: checkValidity(newValue, orderForm[inputIdentifier].validation),
        touched: true
      }
    };
    setOrderForm(newOrderForm);

    // Check form validity
    const newFormValidity = Object.values(newOrderForm).reduce(
      (validity, fieldValidity) => validity && fieldValidity.valid,
      true
    );
    setFormValidity(newFormValidity);
  };

  const formElmentsArray = [];
  for (const key in orderForm) {
    formElmentsArray.push({
      id: key,
      config: orderForm[key]
    });
  }

  return (
    <div className={classes.ContactData}>
      <h4>Enter your Contact Data</h4>

      {props.loading ? (
        <Spinner />
      ) : (
        <form onSubmit={orderHandler}>
          {formElmentsArray.map(formElement => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              invalid={!formElement.config.valid}
              shouldValidate={!!formElement.config.validation}
              touched={formElement.config.touched}
              changed={event => onChangedHandler(event, formElement.id)}
            />
          ))}
          <Button btnType="Success" disabled={!formValidity}>
            ORDER
          </Button>
        </form>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.order.loading,
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: orderData => dispatch(purchaseBurger(orderData))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
