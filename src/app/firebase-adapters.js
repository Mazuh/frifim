import omit from "lodash.omit";
import { firedb } from "./firebase-configs";

/**
 * Factory of generic Firestore client for a given `collection` name,
 * with CRUD operations and a query builder.
 * 
 * All methods will require the `basicData` param
 * (from `useBasicRequestData`) (except `.delete`),
 * thus they're bound to such data as filters or payloads.
 * And there's no need to parse ingoing/outgoing data,
 * this is already done.
 */
export function makeFirestoreApiClient(collection) {
  return {
    query: (basicData) => fireContextQuery(collection, basicData),
    create: (basicData, creatingData) => fireContextCreation(collection, basicData, creatingData),
    read: (basicData) => fireContextQuery(collection, basicData).get().then(parseQuerySnapshot),
    update: (basicData, updatingData) => fireContextUpdate(collection, basicData, updatingData),
    delete: (uuid) => fireContextDeletion(collection, null, uuid),
  };
}

/**
 * Build a `firebase.firestore.Query` to a given `collection` name,
 * but already including all basic filters (from `useBasicRequestData`).
 */
export function fireContextQuery(collection, basicData) {
  return firedb
    .collection(collection)
    .where('userUid', '==', basicData.user.uid)
    .where('project', '==', basicData.project.uuid);
}

/**
 * Call `CollectionReference.prototype.push` to a given `collection` name,
 * but already including all basic payload (from `useBasicRequestData`).
 */
export function fireContextCreation(collection, basicData, entity) {
  const rawCreatingData = { ...entity, project: basicData.project.uuid };
  return firedb
    .collection(collection)
    .add(toFirestoreDocData(rawCreatingData))
    .then(responseRef => ({ ...rawCreatingData, uuid: responseRef.id }));
}

/**
 * Call `DocumentReference.prototype.update` to a given documented
 * identified by `entity.uuid` within a given `collection` name,
 */
export async function fireContextUpdate(collection, basicData, entity) {
  const rawUpdatingData = { ...entity, project: basicData.project.uuid };
  console.log('updating', entity, rawUpdatingData);
  return firedb
    .collection(collection)
    .doc(entity.uuid)
    .update(toFirestoreDocData(rawUpdatingData))
    .then(() => rawUpdatingData);
}

/**
 * Call `DocumentReference.prototype.delete` to a given documented
 * identified by `entitityUid` within a given `collection` name,
 */
export async function fireContextDeletion(collection, basicData, entityUid) {
  return firedb
    .collection(collection)
    .doc(entityUid)
    .delete()
    .then(() => ({ uuid: entityUid }));
}

/**
 * Map domain entity into a Firestore data.
 * 
 * Assures that `uuid` field is dropped,
 * ISO datetimes as strings will become `Date` objects
 * and `userUid` is appended.
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
