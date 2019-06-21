import React from "react";
import { Route, Switch } from "react-router-dom";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Layout from "./hoc/Layout/Layout";
import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout/Logout";
import { connect } from "react-redux";
import { authCheckState } from "./store/actions/auth.actions";
import asyncComponent from './hoc/asyncComponent/asyncComponent';

class App extends React.Component {
  componentDidMount() {
    this.props.authCheckState();
  }
  
  render() {
    const AsyncCheckout = asyncComponent(() => import('./containers/Checkout/Checkout'));
    const AsyncOrders = asyncComponent(() => import('./containers/Orders/Orders'));

    return (
      <div>
        <Layout>
          <Switch>
            <Route path="/checkout" component={AsyncCheckout} />
            <Route path="/orders" component={AsyncOrders} />
            <Route path="/auth" component={Auth} />
            <Route path="/logout" component={Logout} />
            <Route path="/" exact component={BurgerBuilder} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

const mapDispatchToProps = {
  authCheckState
};

export default connect(
  null,
  mapDispatchToProps
)(App);
