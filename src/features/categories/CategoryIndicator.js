import React from 'react';
import { useSelector } from 'react-redux';
import { BsTagFill } from 'react-icons/bs';

export default function CategoryIndicator({ categoryUUID }) {
  const categories = useSelector((state) => state.categories.items);
  const foundCategory = categories.find((it) => it.uuid === categoryUUID);
  const name = foundCategory ? foundCategory.name : 'Sem categoria';
  const color = foundCategory ? foundCategory.color : 'inherit';

  return (
    <span>
      <BsTagFill style={{ color, opacity: foundCategory ? 1 : 0.6 }} /> {name}
    </span>
  );
}
