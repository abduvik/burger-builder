import React, { Component } from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControllers/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

import { connect } from "react-redux";
import { addIngredient, removeIngredient, initIngredients } from "../../store/actions/burgerBuilder.actions";
import { purchaseInit } from "../../store/actions/order.actions";
import { setAuthRedirectPath } from "../../store/actions/auth.actions";

class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: null,
      purchasing: false
    };
  }

  purchaseHandler = () => {
    if (this.props.isAuth) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push("/auth");
    }
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push("/checkout");
  };

  updatePurchaseState(ingredients) {
    const sum = Object.values(ingredients).reduce((sum, val) => (sum += val));
    return sum > 0;
  }

  render() {
    const disabledInfo = {
      ...this.props.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {this.props.ingredients ? (
            <OrderSummary
              ingredients={this.props.ingredients}
              purchaseCancel={this.purchaseCancelHandler}
              price={this.props.totalPrice.toFixed(2)}
              purchaseContinued={this.purchaseContinueHandler}
            />
          ) : (
            <Spinner />
          )}
        </Modal>
        {this.props.ingredients ? (
          <Aux>
            <Burger ingredients={this.props.ingredients} />
            <BuildControls
              ingredientAdded={this.props.onIngredientAdded}
              ingredientRemoved={this.props.onIngredientRemoved}
              disabled={disabledInfo}
              price={this.props.totalPrice}
              isAuth={this.props.isAuth}
              purchasable={this.updatePurchaseState(this.props.ingredients)}
              ordered={this.purchaseHandler}
            />
          </Aux>
        ) : this.props.error ? (
          "Ingredients Can't be loaded"
        ) : (
          <Spinner />
        )}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuth: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingredientName => dispatch(addIngredient(ingredientName)),
    onIngredientRemoved: ingredientName => dispatch(removeIngredient(ingredientName)),
    onInitIngredients: () => dispatch(initIngredients()),
    onInitPurchase: () => dispatch(purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(setAuthRedirectPath(path))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
