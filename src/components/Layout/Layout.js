import React from "react";
import Aux from "../../hoc/Auxiliary";

import classes from "./Layout.module.css";
import Toolbar from "../Navigation/Toolbar/Toolbar";

export default function Layout(props) {
  return (
    <Aux>
      <Toolbar />
      <main className={classes.Content}>{props.children}</main>
    </Aux>
  );
}
