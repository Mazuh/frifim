export const queryByClient = (client, basicData) =>
  basicData.project.guestsUids.length > 0
    ? client.querySharedData(basicData)
    : client.query(basicData);
