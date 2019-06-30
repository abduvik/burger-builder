import React, { useEffect, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Layout from "./hoc/Layout/Layout";
import Logout from "./containers/Auth/Logout/Logout";
import { connect } from "react-redux";
import { authCheckState } from "./store/actions/auth.actions";

const App = props => {
  useEffect(() => {
    props.authCheckState();
  });

  const Checkout = React.lazy(() => import("./containers/Checkout/Checkout"));
  const Orders = React.lazy(() => import("./containers/Orders/Orders"));
  const Auth = React.lazy(() => import("./containers/Auth/Auth"));

  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route path="/checkout" render={() => <Checkout />} />
            <Route path="/orders"  render={() => <Orders />} />
            <Route path="/auth"  render={() => <Auth />} />
            <Route path="/logout" component={Logout} />
            <Route path="/" exact component={BurgerBuilder} />
          </Switch>
        </Suspense>
      </Layout>
    </div>
  );
};

const mapDispatchToProps = {
  authCheckState
};

export default connect(
  null,
  mapDispatchToProps
)(App);
