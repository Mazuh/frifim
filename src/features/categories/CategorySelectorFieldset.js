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
  const isColorTagVisible = selectedColor !== 'inherit';

  const [value, setValue] = React.useState(defaultValue || '');

  React.useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  const handleChange = (event) => {
    const searching = event.target.value;
    const foundCategory = categories.find(it => it.uuid === searching);
    const foundColor = foundCategory ? foundCategory.color : 'inherit';
    setSelecteColor(foundColor || 'inherit');
    setValue(foundCategory ? foundCategory.uuid : '');
  };

  return (
    <Form.Group as={Row} controlId={`${idPrefix}Category`}>
      <Form.Label column xs={12} sm={2}>
        Categoria:
      </Form.Label>
      <Col xs={isColorTagVisible ? 10 : 12} sm={isColorTagVisible ? 9 : 10}>
        <Form.Control
          as="select"
          name="category"
          disabled={isLoading}
          onChange={handleChange}
          value={value}
        >
          <option value="">Sem categoria</option>
          {categories.map(category => (
            <option key={category.uuid} value={category.uuid}>
              {category.name}
            </option>
          ))}
        </Form.Control>
      </Col>
      {isColorTagVisible && (
        <Col xs={2} sm={1} className="d-flex align-items-center justify-content-center">
        <BsTagFill style={{ color: selectedColor }} />
        </Col>
      )}
    </Form.Group>
  );
}
