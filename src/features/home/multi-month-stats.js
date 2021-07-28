import { firedb } from '../../app/firebase-configs';
import { parseQuerySnapshot, toFirestoreDocData } from '../../app/firebase-adapters';

export async function checkAnyBudget(userUid, projectUuid) {
  return (
    (await firedb
      .collection('monthly_budgets')
      .where('userUid', '==', userUid)
      .where('project', '==', projectUuid)
      .limit(1)
      .get()
      .then((snap) => snap.size)) ||
    (await firedb
      .collection('weekly_budgets')
      .where('userUid', '==', userUid)
      .where('project', '==', projectUuid)
      .limit(1)
      .get()
      .then((snap) => snap.size))
  );
}

export async function copyBudgets(userUid, projectUuid, fromPeriod, toPeriod) {
  const batch = firedb.batch();

  const results = await Promise.all(
    ['monthly_budgets', 'weekly_budgets'].map((collection) =>
      firedb
        .collection(collection)
        .where('userUid', '==', userUid)
        .where('project', '==', projectUuid)
        .where('year', '==', fromPeriod.year)
        .where('month', '==', fromPeriod.month)
        .get()
        .then(parseQuerySnapshot)
        .then((founds) =>
          founds.reduce((count, budget) => {
            const docRef = firedb.collection(collection).doc();

            const copying = toFirestoreDocData(budget);
            copying.month = toPeriod.month;
            copying.year = toPeriod.year;

            batch.set(docRef, copying);
            console.log('Copying', copying.name);

            return count + 1;
          }, 0)
        )
    )
  );

  await batch.commit();
  return results.reduce((sum, it) => sum + it, 0);
}
