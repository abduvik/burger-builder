import React, { Component } from "react";
import Aux from "../../hoc/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControllers/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";

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
      purchasing: false
    };
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

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
        <Modal show={this.state.purchasing}>
          <OrderSummary ingredients={this.state.ingredients} />
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
