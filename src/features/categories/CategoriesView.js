import React from 'react';
import Container from 'react-bootstrap/Container';
import { useSelector } from 'react-redux';

export default function CategoriesView() {
  const categories = useSelector(s => s.categories.items);

  return (
    <Container>
      <header>
        <h1>Categorias</h1>
      </header>
      <ul>
        {categories.map(it => (
          <li key={it.uuid}>{it.name}</li>
        ))}
      </ul>
    </Container>
  );
}
