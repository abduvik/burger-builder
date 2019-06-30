import React from "react";
import Aux from "../Auxiliary/Auxiliary";
import Modal from "../../components/UI/Modal/Modal";
import useHttpErrorHandler from "../../hooks/httpErrorHandler";

export default (WrappedComponent, axios) => {
  return props => {

    const [error, errorConfirmedHandler] = useHttpErrorHandler(axios);

    return (
      <Aux>
        <Modal show={error} modalClosed={errorConfirmedHandler}>
          {error ? error.message : ""}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  };
};
