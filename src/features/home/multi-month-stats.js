import { firedb } from "../../app/firebase-configs";

export async function checkAnyBudget(userUid, projectUuid) {
  return (
    await firedb
      .collection('monthly_budgets')
      .where('userUid', '==', userUid)
      .where('project', '==', projectUuid)
      .limit(1)
      .get()
      .then(snap => snap.size)
  ) || (
    await firedb
      .collection('weekly_budgets')
      .where('userUid', '==', userUid)
      .where('project', '==', projectUuid)
      .limit(1)
      .get()
      .then(snap => snap.size)
  );
};
