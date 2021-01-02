import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

export default function LoadingMainContainer() {
  return (
    <Container as="main" className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="info" role="status" className="mr-3" />
      Carregando dados...
    </Container>
  );
};
