import Decimal from 'decimal.js';
import React from 'react';
import { Chart } from 'frappe-charts';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import './relevantCategories.css';

export default function RelevantCategoriesChart({ datasetName, groupedAmountsByCategory }) {
  const chartRef = React.useRef(null);
  const idRef = React.useRef(`budgets-chart-${uuidv4()}`);
  const id = idRef.current;
  const idSelector = `#${id}`;

  const categories = useSelector((state) => state.categories.items);
  const sortedAmounts = groupedAmountsByCategory.sort((a, b) =>
    Decimal(b.amount).minus(a.amount).toFixed(2)
  );

  React.useEffect(() => {
    if (chartRef.current) {
      return;
    }

    chartRef.current = new Chart(idSelector, {
      title: '',
      type: 'pie',
      // height: 300,
      colors: sortedAmounts.map((amount) => {
        const category = categories.find((c) => c.uuid === amount.category);
        return category ? category.color : '#6c757d';
      }),
      data: {
        labels: sortedAmounts.map((amount) => {
          const category = categories.find((c) => c.uuid === amount.category);
          return category ? category.name : amount.category;
        }),
        datasets: [{ name: datasetName, values: sortedAmounts.map((data) => data.amount) }],
      },
    });
  }, [idSelector, categories, sortedAmounts, datasetName]);

  return <div className={getChartSizeClass(sortedAmounts.length)} id={id} />;
}

function getChartSizeClass(dataLength) {
  if (dataLength <= 3) {
    return 'relevance-chart-sm';
  }

  if (dataLength < 6) {
    return 'relevance-chart-md';
  }

  return 'relevance-chart-lg';
}
