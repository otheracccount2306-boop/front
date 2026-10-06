export const openSpaceOnMap = (navigation, spaceId) => {
  if (!navigation || !spaceId) {
    return;
  }
  navigation.navigate('CampusTab', {
    screen: 'CampusMap',
    initial: false,
    params: { spaceId },
  });
};

export default openSpaceOnMap;
