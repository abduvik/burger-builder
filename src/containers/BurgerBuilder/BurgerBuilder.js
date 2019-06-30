import React, { useState, useEffect } from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControllers/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

import { connect } from "react-redux";
import {
  addIngredient,
  removeIngredient,
  initIngredients
} from "../../store/actions/burgerBuilder.actions";
import { purchaseInit } from "../../store/actions/order.actions";
import { setAuthRedirectPath } from "../../store/actions/auth.actions";

const BurgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    props.onInitIngredients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const purchaseHandler = () => {
    if (props.isAuth) {
      setPurchasing(true);
    } else {
      props.onSetAuthRedirectPath("/checkout");
      props.history.push("/auth");
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    props.onInitPurchase();
    props.history.push("/checkout");
  };

  const updatePurchaseState = ingredients => {
    const sum = Object.values(ingredients).reduce((sum, val) => (sum += val));
    return sum > 0;
  };

  const disabledInfo = {
    ...props.ingredients
  };

  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {props.ingredients ? (
          <OrderSummary
            ingredients={props.ingredients}
            purchaseCancel={purchaseCancelHandler}
            price={props.totalPrice.toFixed(2)}
            purchaseContinued={purchaseContinueHandler}
          />
        ) : (
          <Spinner />
        )}
      </Modal>
      {props.ingredients ? (
        <Aux>
          <Burger ingredients={props.ingredients} />
          <BuildControls
            ingredientAdded={props.onIngredientAdded}
            ingredientRemoved={props.onIngredientRemoved}
            disabled={disabledInfo}
            price={props.totalPrice}
            isAuth={props.isAuth}
            purchasable={updatePurchaseState(props.ingredients)}
            ordered={purchaseHandler}
          />
        </Aux>
      ) : props.error ? (
        "Ingredients Can't be loaded"
      ) : (
        <Spinner />
      )}
    </Aux>
  );
};

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
    onIngredientAdded: ingredientName =>
      dispatch(addIngredient(ingredientName)),
    onIngredientRemoved: ingredientName =>
      dispatch(removeIngredient(ingredientName)),
    onInitIngredients: () => dispatch(initIngredients()),
    onInitPurchase: () => dispatch(purchaseInit()),
    onSetAuthRedirectPath: path => dispatch(setAuthRedirectPath(path))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
