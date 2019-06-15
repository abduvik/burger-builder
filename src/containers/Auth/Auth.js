import React, { Component } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";

import classes from "./Auth.module.css";
import { auth } from "../../store/actions/auth.actions";
import { connect } from "react-redux";

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Mail Address"
        },
        value: "",
        validation: { required: true, isEmail: true },
        valid: false,
        touched: false
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password"
        },
        value: "",
        validation: { required: true, minLength: 6 },
        valid: false,
        touched: false
      }
    }
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "";
    }

    if (rules.minLength) {
      isValid = isValid && value.length >= rules.minLength;
    }

    if (rules.maxLength) {
      isValid = isValid && value.length >= rules.maxLength;
    }

    return isValid;
  }

  onChangedHandler = (event, inputIdentifier) => {
    const newValue = event.target.value;
    this.setState(state => {
      const newState = {
        ...state,
        controls: {
          ...state.controls,
          [inputIdentifier]: {
            ...state.controls[inputIdentifier],
            value: newValue,
            valid: this.checkValidity(newValue, state.controls[inputIdentifier].validation),
            touched: true
          }
        }
      };

      // Check form validity
      const formValidity = Object.values(newState.controls).reduce(
        (validity, fieldValidity) => validity && fieldValidity.valid,
        true
      );

      newState.formValidity = formValidity;
      return newState;
    });
  };

  onSubmitHandler = (event) => {
    event.preventDefault();
    this.props.auth(this.state.controls.email.value,this.state.controls.password.value);
  }

  render() {
    const formElmentsArray = [];
    for (const key in this.state.controls) {
      formElmentsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    return (
      <div className={classes.Auth}>
        <form onSubmit={this.onSubmitHandler}>
          {formElmentsArray.map(formElement => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              invalid={!formElement.config.valid}
              shouldValidate={!!formElement.config.validation}
              touched={formElement.config.touched}
              changed={event => this.onChangedHandler(event, formElement.id)}
            />
          ))}
          <Button btnType="Success">Submit</Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    auth
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
