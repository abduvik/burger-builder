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
import * as storeActions from "../../store/actions";

class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: null,
      purchasing: false,
      loading: false,
      error: true
    };
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  componentDidMount() {
    // axios
    //   .get("/ingredients.json")
    //   .then(response => {
    //     this.setState({
    //       ingredients: response.data
    //     });
    //   })
    //   .catch(error => this.setState({ error: true }));
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
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
          {this.state.loading ? (
            <Spinner />
          ) : this.props.ingredients ? (
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
              purchasable={this.updatePurchaseState(this.props.ingredients)}
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

const mapStateToProps = state => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingredientName => dispatch(storeActions.addIngredient(ingredientName)),
    onIngredientRemoved: ingredientName => dispatch(storeActions.removeIngredient(ingredientName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
