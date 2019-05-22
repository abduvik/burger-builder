import React, { Component } from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControllers/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 0.4,
  meat: 1.3
};

class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: null,
      totalPrice: 4,
      purchasable: false,
      purchasing: false,
      loading: false,
      error: true
    };
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  componentDidMount() {
    axios
      .get("/ingredients.json")
      .then(response => {
        this.setState({
          ingredients: response.data
        });
      })
      .catch(error => this.setState({ error: true }));
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + "=" + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push("price=" + this.state.totalPrice);
    const queryString = queryParams.join("&");

    this.props.history.push({
      pathname: "/checkout",
      search: "?" + queryString
    });
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
          ) : this.state.ingredients ? (
            <OrderSummary
              ingredients={this.state.ingredients}
              purchaseCancel={this.purchaseCancelHandler}
              price={this.state.totalPrice.toFixed(2)}
              purchaseContinued={this.purchaseContinueHandler}
            />
          ) : (
            <Spinner />
          )}
        </Modal>
        {this.state.ingredients ? (
          <Aux>
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
        ) : this.state.error ? (
          "Ingredients Can't be loaded"
        ) : (
          <Spinner />
        )}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
