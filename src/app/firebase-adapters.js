import omit from "lodash.omit";
import { firedb } from "./firebase-configs";

/**
 * Build a `firebase.firestore.Query` to a given `collection`,
 * but already including all basic filters (from `useBasicRequestData`).
 */
export function fireContextQuery(collection, basicData) {
  return firedb
    .collection(collection)
    .where('userUid', '==', basicData.user.uid)
    .where('project', '==', basicData.project.uuid);
}

/**
 * Map domain entity into a Firestore data.
 * 
 * Assures that `uuid` field is dropped
 * and ISO datetimes as strings will become `Date` objects.
 */
export function toFirestoreDocData(entity) {
  const requestResource = omit(entity, 'uuid');

  Object.keys(requestResource).forEach((key) => {
    const value = requestResource[key];
    if (rIsoDatetime.test(value)) {
      requestResource[key] = new Date(value);
    }
  });

  if (!requestResource.userUid) {
    requestResource.userUid = firedb.app.auth().currentUser.uid;
  }

  return requestResource;
}

/**
 * Same as `parseFirestoreDocSnapshot`, but accepts
 * a `snapshot` with multiple `snapshot.docs` in it.
 */
export function parseQuerySnapshot(snapshot) {
  return snapshot.docs.map(parseFirestoreDocSnapshot);
}

/**
 * Map Firestore document snapshot (a class instance)
 * into a domain entity (a plain object).
 *
 * It'll undo type conversions made by `toFirestoreDocData`.
 */
export function parseFirestoreDocSnapshot(doc) {
  const responseData = doc.data();

  Object.keys(responseData).forEach((key) => {
    const value = responseData[key];
    if (typeof value === "object" && value.seconds && value.nanoseconds) {
      responseData[key] = value.toDate().toISOString();
    }
  });

  responseData.uuid = doc.id;

  return responseData;
}

/**
 * See: https://stackoverflow.com/a/3143231
 */
const rIsoDatetime = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
