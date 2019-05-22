import React from "react";
import classes from "./Order.module.css";

export default function Order() {
  return (
    <div className={classes.Order}>
      <p>Ingredients: Salad (1)</p>
      <p>
        Price <strong>USD 5.00</strong>
      </p>
    </div>
  );
}
