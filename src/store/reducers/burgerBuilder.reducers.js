import * as actionType from "../actions/actionTypes";

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 0.4,
  meat: 1.3
};

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  building: true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.payload.ingredientName]: state.ingredients[action.payload.ingredientName] + 1
        },
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.payload.ingredientName],
        building: true
      };
    case actionType.REMOVE_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.payload.ingredientName]: state.ingredients[action.payload.ingredientName] - 1
        },
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.payload.ingredientName],
        building: true
      };
    case actionType.SET_INGREDIENTS:
      return {
        ...state,
        ingredients: {
          salad: action.payload.ingredients.salad,
          bacon: action.payload.ingredients.bacon,
          cheese: action.payload.ingredients.cheese,
          meat: action.payload.ingredients.meat
        },
        totalPrice: initialState.totalPrice,
        error: false,
        building: false
      };
    case actionType.FETCH_INGREDIENTS_FAILED:
      return {
        ...state,
        error: true
      };
    default:
      return state;
  }
};

export default reducer;
