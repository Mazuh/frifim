import get from 'lodash.get';

export const queryByClient = (client, basicData) => {
  return get(basicData, 'project.guestsEmails', []).length > 0
    ? client.querySharedData(basicData)
    : client.query(basicData);
};
