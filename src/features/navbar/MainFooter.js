import React from 'react';
import Container from "react-bootstrap/Container";

export default function MainFooter() {
  return (
    <footer className="bg-light border-top mt-5">
      <Container className="w-100 pt-5 pb-3">
        <p className="text-center text-muted">
          <small>
            Feito e mantido por
            {' '}
            <a
              href="https://github.com/Mazuh/moneycog"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mazuh
            </a>
            {' '}
            sob
            {' '}
            <a
              href="https://github.com/Mazuh/moneycog/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
            >
              MIT License
            </a>
            .
          </small>
        </p>
      </Container>
    </footer>
  );
}
