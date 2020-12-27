import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

export default function LoadingContainer() {
  return (
    <Container className="d-flex justify-content-center align-items-center pb-5 mb-5 pt-5 mt-5">
      <Spinner animation="border" variant="info" role="status" className="mr-3" />
      Carregando dados...
    </Container>
  );
};
