export const openSpaceOnMap = (navigation, spaceId) => {
  if (!navigation || !spaceId) {
    return;
  }
  navigation.navigate('CampusTab', { screen: 'CampusMap', params: { spaceId } });
};

export default openSpaceOnMap;
