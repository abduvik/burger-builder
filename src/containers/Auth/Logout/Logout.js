import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authLogout } from "./../../../store/actions/auth.actions";

class Logout extends Component {
  componentDidMount() {
    console.log(this);
    this.props.authLogout();
  }

  render() {
    return <Redirect to="/" />;
  }
}

const mapDispatchToProps = dispatch => ({
  authLogout: () => dispatch(authLogout())
});

export default connect(
  null,
  mapDispatchToProps
)(Logout);
