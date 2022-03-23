import get from 'lodash.get';

export const queryByClient = (client, basicData) => {
  return get(basicData, 'project.guestsEmails', null)
    ? client.querySharedData(basicData)
    : client.query(basicData);
};
