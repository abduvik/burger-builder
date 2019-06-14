import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import axios from "../../../axios-orders";

import { connect } from "react-redux";

import classes from "./ContactData.module.css";
import Spinner from "../../../components/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { purchaseBurger } from "./../../../store/actions/order.actions";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name"
        },
        value: "",
        validation: { required: true },
        valid: false,
        touched: false
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Street"
        },
        value: "",
        validation: { required: true },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "ZIP Code"
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 7
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country"
        },
        value: "",
        validation: { required: true },
        valid: false,
        touched: false
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Email"
        },
        value: "",
        validation: { required: true },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [{ value: "fastest", displayValue: "Fastest" }, { value: "cheapest", displayValue: "Cheapest" }]
        },
        validation: {},
        value: "cheapest",
        valid: true
      }
    },
    formValidity: false
  };

  orderHandler = event => {
    event.preventDefault();
    const formData = {};
    for (const formElementIndentifier in this.state.orderForm) {
      formData[formElementIndentifier] = this.state.orderForm[formElementIndentifier].value;
    }

    const order = {
      ingredients: this.props.ingredients,
      totalPrice: this.props.totalPrice,
      orderData: formData
    };

    this.props.onOrderBurger(order);
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "";
    }

    if (rules.minLength) {
      isValid = isValid && value.length >= rules.minLength;
    }

    if (rules.maxLength) {
      isValid = isValid && value.length >= rules.maxLength;
    }

    return isValid;
  }

  onChangedHandler = (event, inputIdentifier) => {
    const newValue = event.target.value;
    this.setState(state => {
      const newState = {
        ...state,
        orderForm: {
          ...state.orderForm,
          [inputIdentifier]: {
            ...state.orderForm[inputIdentifier],
            value: newValue,
            valid: this.checkValidity(newValue, state.orderForm[inputIdentifier].validation),
            touched: true
          }
        }
      };

      // Check form validity
      const formValidity = Object.values(newState.orderForm).reduce(
        (validity, fieldValidity) => validity && fieldValidity.valid,
        true
      );

      newState.formValidity = formValidity;
      return newState;
    });
  };

  render() {
    const formElmentsArray = [];
    for (const key in this.state.orderForm) {
      formElmentsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>

        {this.props.loading ? (
          <Spinner />
        ) : (
          <form onSubmit={this.orderHandler}>
            {formElmentsArray.map(formElement => (
              <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={!!formElement.config.validation}
                touched={formElement.config.touched}
                changed={event => this.onChangedHandler(event, formElement.id)}
              />
            ))}
            <Button btnType="Success" disabled={!this.state.formValidity}>
              ORDER
            </Button>
          </form>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.order.loading,
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice
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
