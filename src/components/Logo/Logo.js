import React from "react";

import classes from "./Logo.module.css";

import BurgerLogo from "../../assets/images/burger-logo.png";

export default function Logo() {
  return (
    <div className={classes.Logo}>
      <img src={BurgerLogo} alt="Logo" />
    </div>
  );
}
