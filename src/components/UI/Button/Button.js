import React from "react";

import classes from "./Button.module.css";

export default function Button(props) {
  return (
    <button onClick={props.clicked}>
      {props.children}
      className={[classes.Button, classes[props.btnType]].join(" ")}
    </button>
  );
}
