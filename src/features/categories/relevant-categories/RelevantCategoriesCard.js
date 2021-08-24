import Decimal from 'decimal.js';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { useSelector } from 'react-redux';
import RelevantCategoriesChart from './RelevantCategoriesChart';

export default function RelevantsCategoriesCard({ cardTitle, cardIcon, groupedAmountsByCategory }) {
  const [showOthers, setShowOthers] = React.useState(false);
  const categories = useSelector((state) => state.categories.items);
  const sortedAmounts = groupedAmountsByCategory.sort((a, b) =>
    Decimal(b.amount).minus(a.amount).toFixed(2)
  );
  return (
    <Card>
      <Card.Header className="bg-dark text-light d-flex justify-content-between">
        <Card.Title as="h2">
          {cardIcon} {cardTitle}
        </Card.Title>
        {sortedAmounts.length > 3 && (
          <Button
            className="text-light"
            onClick={() => setShowOthers(!showOthers)}
            variant="link"
            aria-controls="collapse-list"
            aria-expanded={showOthers}
          >
            {!showOthers ? 'Ver mais' : 'Ver menos'}
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <ol className="mb-0">
          {sortedAmounts.slice(0, 3).map((sa) => {
            const currentCategory = categories.find((category) => category.uuid === sa.category);
            return (
              <li key={sa.category}>
                {`${currentCategory ? currentCategory.name : 'Sem categoria'}: R$ ${sa.amount}`}
              </li>
            );
          })}
        </ol>
        {sortedAmounts.length > 3 && (
          <Collapse in={showOthers}>
            <ol start="4" id="collapse-list">
              {sortedAmounts.slice(3).map((sa) => {
                const currentCategory = categories.find(
                  (category) => category.uuid === sa.category
                );
                return (
                  <li key={sa.category}>
                    {`${currentCategory ? currentCategory.name : 'Sem categoria'}: R$ ${sa.amount}`}
                  </li>
                );
              })}
            </ol>
          </Collapse>
        )}
        <RelevantCategoriesChart
          datasetName={cardTitle}
          groupedAmountsByCategory={groupedAmountsByCategory}
        />
      </Card.Body>
    </Card>
  );
}
