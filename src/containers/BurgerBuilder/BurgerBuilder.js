import React, { Component } from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControllers/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/Spinner/Spinner";

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 0.4,
  meat: 1.3
};

export default class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: {
        salad: 0,
        bacon: 0,
        cheese: 0,
        meat: 0
      },
      totalPrice: 4,
      purchasable: false,
      purchasing: false,
      loading: false
    };
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    // alert("Continue");
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
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
      .then(response => console.log(response))
      .catch(response => console.log(response))
      .finally(() =>
        this.setState({
          loading: false,
          purchasing: false
        })
      );
  };

  updatePurchaseState(state) {
    const sum = Object.values(state.ingredients).reduce((sum, val) => (sum += val));
    return sum > 0;
  }

  addIngredientHandler = type => {
    this.setState(prevState => {
      const newState = {
        totalPrice: prevState.totalPrice + INGREDIENT_PRICES[type],
        ingredients: {
          ...prevState.ingredients,
          [type]: prevState.ingredients[type] + 1
        }
      };
      newState.purchasable = this.updatePurchaseState(newState);
      return newState;
    });
  };

  removeIngredientHandler = type => {
    this.setState(prevState => {
      const newState = {
        totalPrice: prevState.totalPrice - INGREDIENT_PRICES[type],
        ingredients: {
          ...prevState.ingredients,
          [type]: prevState.ingredients[type] ? prevState.ingredients[type] - 1 : 0
        }
      };
      newState.purchasable = this.updatePurchaseState(newState);
      return newState;
    });
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <OrderSummary
              ingredients={this.state.ingredients}
              purchaseCancel={this.purchaseCancelHandler}
              price={this.state.totalPrice.toFixed(2)}
              purchaseContinued={this.purchaseContinueHandler}
            />
          )}
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler}
        />
      </Aux>
    );
  }
}
