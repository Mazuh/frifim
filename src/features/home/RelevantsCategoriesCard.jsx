import Decimal from 'decimal.js';
import React from 'react';
import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';

export default function RelevantsCategoriesCard({ cardTitle, cardIcon, groupedAmountsByCategory }) {
  const categories = useSelector((state) => state.categories.items);
  return (
    <Card>
      <Card.Header className="bg-dark text-light">
        <Card.Title as="h2">
          {cardIcon} {cardTitle}
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <ol>
          {groupedAmountsByCategory
            .sort((a, b) => Decimal(b.amount).minus(a.amount).toFixed(2))
            .slice(0, 3)
            .map((income) => {
              const currentCategory = categories.find(
                (category) => category.uuid === income.category
              );
              return (
                <li key={income.category}>
                  {`${currentCategory ? currentCategory.name : 'Sem categoria'}: R$ ${
                    income.amount
                  }`}
                </li>
              );
            })}
        </ol>
      </Card.Body>
    </Card>
  );
}
