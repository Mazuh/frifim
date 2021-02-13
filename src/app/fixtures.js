import omit from "lodash.omit";
import { v4 as uuidv4 } from "uuid";
import { EXPENSE_TYPE, INCOME_TYPE } from "../features/categories/constants";
import { WEEK_DAYS } from "../features/weekly-budget/constants";
import { firedb } from "./firebase-configs";

function persistFixtures(userUid = firedb.app.auth().currentUser.uid) {
  console.log('Appending fixture data to user', userUid);
  const batch = firedb.batch();

  const toDbData = (entity) => ({ ...omit(entity, 'uuid'), userUid });
  const setFixturesOnBatch = (entities, collection) => {
    console.log('Batching', collection, entities);
    entities.forEach((entity) => {
      const docRef = firedb.collection(collection).doc(entity.uuid);
      const data = toDbData(entity);
      batch.set(docRef, data);
    });
  };

  setFixturesOnBatch(PROJECTS_FIXTURE, 'projects');
  setFixturesOnBatch(CATEGORIES_FIXTURE, 'categories');
  setFixturesOnBatch(MONTHLY_BUDGETS_FIXTURE, 'monthly_budgets');
  setFixturesOnBatch(WEEKLY_BUDGETS_FIXTURE, 'weekly_budgets');
  setFixturesOnBatch(TRANSACTIONS_FIXTURE.map(it => ({ ...it, datetime: new Date(it.datetime) })), 'transactions');

  batch.commit();
  console.log('Commit sent.');
}

const TAG_COLORS = Object.freeze([
  '#59BE4A',
  '#F2D730',
  '#1277C0',
]);

const PROJECTS_FIXTURE = [
  { uuid: uuidv4(), name: 'Principal' },
];

const CATEGORIES_FIXTURE = [
  { uuid: uuidv4(), name: 'Empresa Acme', color: TAG_COLORS[0], project: PROJECTS_FIXTURE[0].uuid },
  { uuid: uuidv4(), name: 'Entretenimento', color: TAG_COLORS[2], project: PROJECTS_FIXTURE[0].uuid },
  { uuid: uuidv4(), name: 'Moradia', color: TAG_COLORS[1], project: PROJECTS_FIXTURE[0].uuid },
  { uuid: uuidv4(), name: 'Alimentação', color: TAG_COLORS[2], project: PROJECTS_FIXTURE[0].uuid },
  { uuid: uuidv4(), name: 'Transporte', color: TAG_COLORS[2], project: PROJECTS_FIXTURE[0].uuid },
  { uuid: uuidv4(), name: 'Saúde', color: TAG_COLORS[2], project: PROJECTS_FIXTURE[0].uuid },
];

const TRANSACTIONS_FIXTURE = [
  {
    uuid: uuidv4(),
    datetime: (new Date()).toISOString(),
    name: 'Um negócio aí',
    type: EXPENSE_TYPE.value,
    amount: '69.00',
    category: '',
    project: PROJECTS_FIXTURE[0].uuid,
  },
  {
    uuid: uuidv4(),
    datetime: (new Date()).toISOString(),
    name: 'Salário (após IR e FGTS)',
    type: INCOME_TYPE.value,
    amount: '1500.00',
    category: CATEGORIES_FIXTURE[0].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
  },
  {
    uuid: uuidv4(),
    datetime: (new Date()).toISOString(),
    name: 'Netflix',
    type: EXPENSE_TYPE.value,
    amount: '45.90',
    category: CATEGORIES_FIXTURE[1].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
  },
];

const WEEKLY_BUDGETS_FIXTURE = [
  {
    uuid: uuidv4(),
    name: 'Compras pro almoço',
    type: EXPENSE_TYPE.value,
    day: WEEK_DAYS[0].value,
    amount: '65.00',
    category: CATEGORIES_FIXTURE[3].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: 'Janta (delivery)',
    type: EXPENSE_TYPE.value,
    day: WEEK_DAYS[0].value,
    amount: '20.00',
    category: CATEGORIES_FIXTURE[3].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: 'Freelance Bar',
    type: INCOME_TYPE.value,
    day: WEEK_DAYS[4].value,
    amount: '199.99',
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: 'Jantar caro',
    type: EXPENSE_TYPE.value,
    day: WEEK_DAYS[4].value,
    amount: '100.00',
    category: CATEGORIES_FIXTURE[3].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: 'Curtição',
    type: EXPENSE_TYPE.value,
    day: WEEK_DAYS[5].value,
    amount: '150.00',
    category: CATEGORIES_FIXTURE[1].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: 'Curtição',
    type: EXPENSE_TYPE.value,
    day: WEEK_DAYS[6].value,
    amount: '200.00',
    category: CATEGORIES_FIXTURE[1].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
];

const MONTHLY_BUDGETS_FIXTURE = [
  {
    uuid: uuidv4(),
    name: "Salário (após IR e FGTS)",
    type: INCOME_TYPE.value,
    amount: "1500.00",
    category: CATEGORIES_FIXTURE[0].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Freelance Foo",
    type: INCOME_TYPE.value,
    amount: "1000.00",
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Reserva de emergência",
    type: EXPENSE_TYPE.value,
    amount: "300.00",
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Aluguel",
    type: EXPENSE_TYPE.value,
    amount: "200.00",
    category: CATEGORIES_FIXTURE[2].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Energia",
    type: EXPENSE_TYPE.value,
    amount: "150.00",
    category: CATEGORIES_FIXTURE[2].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Animal de estimação",
    type: EXPENSE_TYPE.value,
    amount: "150.00",
    category: CATEGORIES_FIXTURE[2].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Transporte",
    type: EXPENSE_TYPE.value,
    amount: "350.00",
    category: CATEGORIES_FIXTURE[4].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Plano de saúde",
    type: EXPENSE_TYPE.value,
    amount: "90.00",
    category: CATEGORIES_FIXTURE[5].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Remédios",
    type: EXPENSE_TYPE.value,
    amount: "50.00",
    category: CATEGORIES_FIXTURE[5].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Academia",
    type: EXPENSE_TYPE.value,
    amount: "59.99",
    category: CATEGORIES_FIXTURE[5].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Compras gerais do lar",
    type: EXPENSE_TYPE.value,
    amount: "350.00",
    category: CATEGORIES_FIXTURE[2].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Entretenimento geral (festas, jogos etc)",
    type: EXPENSE_TYPE.value,
    amount: "200.00",
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
  {
    uuid: uuidv4(),
    name: "Netflix",
    type: EXPENSE_TYPE.value,
    amount: "45.90",
    category: CATEGORIES_FIXTURE[1].uuid,
    project: PROJECTS_FIXTURE[0].uuid,
    month: 0,
    year: 2021,
  },
];

// for devs!
if (process.env.NODE_ENV !== 'production') {
  window.persistFixtures = persistFixtures;
  window.firedb = firedb;
}
