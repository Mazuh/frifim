import omit from 'lodash.omit';
import { v4 as uuidv4 } from 'uuid';
import { firedb } from '../app/firebase-configs';

export const initialCategories = [
  {
    name: 'Transporte',
    color: '#A95AA1',
    uuid: uuidv4(),
  },
  {
    name: 'Moradia',
    color: '#F5793A',
    uuid: uuidv4(),
  },
  {
    name: 'Educação',
    color: '#85C0F9',
    uuid: uuidv4(),
  },
  {
    name: 'Alimentaçao',
    color: ' #ABC3C9',
    uuid: uuidv4(),
  },
  {
    name: 'Saúde',
    color: ' #63ACBE',
    uuid: uuidv4(),
  },
  {
    name: 'Lazer',
    color: ' #EBE7E0',
    uuid: uuidv4(),
  },
];

export const createCollectionsOnBatch = (userUid, projectRef, collection, entities) => {
  const batch = firedb.batch();

  const toDbData = (entity) => ({ ...omit(entity, 'uuid'), userUid, project: projectRef.id });
  entities.forEach((entity) => {
    const docRef = firedb.collection(collection).doc(entity.uuid);
    const data = toDbData(entity);
    batch.set(docRef, data);
  });

  batch.commit();
};
