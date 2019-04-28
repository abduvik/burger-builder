import React, { Component } from "react";

import classes from "./BuildControls.module.css";
import BuildControl from "./BuildControl/BuildControl";

const controls = [
  { label: "Salad", type: "salad" },
  { label: "Bacon", type: "bacon" },
  { label: "Cheese", type: "cheese" },
  { label: "Meat", type: "meat" }
];

export default class BuildControls extends Component {
  render() {
    return <div className={classes.BuildControls}>{
      controls.map(ctrl => (<BuildControl key={ctrl.label} label={ctrl.label} />))
    }</div>;
  }
}
