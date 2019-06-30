import React, { useState, useEffect } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";

import classes from "./Auth.module.css";
import { auth, setAuthRedirectPath } from "../../store/actions/auth.actions";
import { connect } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import { Redirect } from "react-router-dom";
import { FormData } from "./FormData";
import { checkValidity } from "../../utils/checkValidity";

const Auth = props => {
  const [controls, setControls] = useState(FormData);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (!props.buildingBurger && props.authRedirectPath !== "/") {
      props.setAuthRedirectPath("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangedHandler = (event, inputIdentifier) => {
    const newValue = event.target.value;

    const newControls = {
      ...controls,
      [inputIdentifier]: {
        ...controls[inputIdentifier],
        value: newValue,
        valid: checkValidity(newValue, controls[inputIdentifier].validation),
        touched: true
      }
    };

    setControls(newControls);
  };

  const onSubmitHandler = event => {
    event.preventDefault();
    props.auth(
      controls.email.value,
      controls.password.value,
      isSignUp
    );
  };

  const onSwitchSignInHandler = () => {
    setIsSignUp(!isSignUp);
  };

  if (props.isAuth) {
    return <Redirect to={props.authRedirectPath} />;
  }

  const formElmentsArray = [];
  for (const key in controls) {
    formElmentsArray.push({
      id: key,
      config: controls[key]
    });
  }

  return (
    <div className={classes.Auth}>
      <form onSubmit={onSubmitHandler}>
        {props.loading ? (
          <Spinner />
        ) : (
          formElmentsArray.map(formElement => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              invalid={!formElement.config.valid}
              shouldValidate={!!formElement.config.validation}
              touched={formElement.config.touched}
              changed={event => onChangedHandler(event, formElement.id)}
            />
          ))
        )}
        <div>{props.error ? props.error.message : null}</div>
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button clicked={onSwitchSignInHandler} btnType="Danger">
        SWITCH TO {isSignUp ? "SIGN IN" : "SIGN UP"}
      </Button>
    </div>
  );
};

const mapStateToProps = state => ({
  loading: state.auth.loading,
  error: state.auth.error,
  isAuth: state.auth.token !== null,
  buildingBurger: state.burgerBuilder.building,
  authRedirectPath: state.auth.authRedirectPath
});

const mapDispatchToProps = {
  auth,
  setAuthRedirectPath
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
