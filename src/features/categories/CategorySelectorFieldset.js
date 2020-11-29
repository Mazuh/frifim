import React from 'react';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from 'react-redux';
import { BsTagFill } from 'react-icons/bs';

export default function CategorySelectorFieldset ({ idPrefix='form', defaultValue = null }) {
  const categories = useSelector(state => state.categories.items);
  const isLoading = useSelector(state => state.categories.isLoading);
  const [selectedColor, setSelecteColor] = React.useState('inherit');

  const handleChange = (event) => {
    const searching = event.target.value;
    const foundCategory = categories.find(it => it.uuid === searching);
    const foundColor = foundCategory ? foundCategory.color : 'inherit';
    setSelecteColor(foundColor || 'inherit');
  };

  return (
    <Form.Group as={Row} controlId={`${idPrefix}Category`}>
      <Form.Label column sm={2}>
        Categoria:
      </Form.Label>
      <Col sm={9}>
        <Form.Control
          as="select"
          name="category"
          defaultValue={defaultValue}
          disabled={isLoading}
          onChange={handleChange}
        >
          <option value="">Sem categoria</option>
          {categories.map(category => (
            <option key={category.uuid} value={category.uuid}>
              {category.name}
            </option>
          ))}
        </Form.Control>
      </Col>
      <Col sm={1}>
        <BsTagFill style={{ color: selectedColor }} />
      </Col>
    </Form.Group>
  );
}
