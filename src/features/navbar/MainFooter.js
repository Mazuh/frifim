import React from 'react';
import Container from "react-bootstrap/Container";

export default function MainFooter() {
  return (
    <footer className="bg-secondary text-white border-top mt-5" style={{ maxHeight: '25vh' }}>
      <Container className="w-100 pt-5 pb-3">
        <p className="text-center">
          <small>
            ©
            {' '}
            <a
              className="text-light"
              href="https://github.com/mazuh/frifim"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mazuh
            </a>
            {' '}
            (MIT License)
          </small>
        </p>
      </Container>
    </footer>
  );
}
