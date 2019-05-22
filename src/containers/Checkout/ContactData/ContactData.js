import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import axios from "../../../axios-orders";

import classes from "./ContactData.module.css";
import Spinner from "../../../components/Spinner/Spinner";

export default class ContactData extends Component {
  state = {
    name: "",
    email: "",
    address: {
      street: "",
      postalCode: ""
    },
    loading: false
  };

  orderHandler = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: "Abdelrahman ElNaggar",
        address: {
          stree: "Maadi",
          zipCode: "12345",
          country: "Egypt"
        },
        email: "test@test.com"
      },
      deliveryMethod: "fastest"
    };

    axios
      .post("/orders.json", order)
      .then(response => this.props.history.push("/"))
      .catch(response => console.log(response))
      .finally(() =>
        this.setState({
          loading: false,
          purchasing: false
        })
      );
  };

  render() {
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>

        {this.state.loading ? (
          <Spinner />
        ) : (
          <form>
            <input type="text" name="name" placeholder="Your Name" />
            <input type="email" name="email" placeholder="Your Mail" />
            <input type="text" name="street" placeholder="Street" />
            <input type="text" name="postal" placeholder="Postal Code" />
            <Button btnType="Success" clicked={this.orderHandler}>
              ORDER
            </Button>
          </form>
        )}
      </div>
    );
  }
}
