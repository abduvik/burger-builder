import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authLogout } from "./../../../store/actions/auth.actions";

const Logout = props => {
  useEffect(() => {
    props.authLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Redirect to="/" />;
};

const mapDispatchToProps = dispatch => ({
  authLogout: () => dispatch(authLogout())
});

export default connect(
  null,
  mapDispatchToProps
)(Logout);
