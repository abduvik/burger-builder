import React, { Component } from "react";
import Aux from "../../hoc/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControllers/BuildControls";

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
      totalPrice: 4
    };
  }

  addIngredientHandler = type => {
    this.setState(prevState => {
      return {
        totalPrice: prevState.totalPrice + INGREDIENT_PRICES[type],
        ingredients: {
          ...prevState.ingredients,
          [type]: prevState.ingredients[type] + 1
        }
      };
    });
  };

  removeIngredientHandler = type => {
    this.setState(prevState => {
      return {
        totalPrice: prevState.totalPrice - INGREDIENT_PRICES[type],
        ingredients: {
          ...prevState.ingredients,
          [type]: prevState.ingredients[type] ? prevState.ingredients[type] - 1 : 0
        }
      };
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
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
        />
      </Aux>
    );
  }
}
