import { openSpaceOnMap } from "../campusLinks";

describe("openSpaceOnMap", () => {
  test("abre el mapa del módulo Campus con el espacio, encima de la lista de espacios", () => {
    const navigation = { navigate: jest.fn() };
    openSpaceOnMap(navigation, "abc");
    expect(navigation.navigate).toHaveBeenCalledWith("CampusTab", {
      screen: "CampusMap",
      initial: false,
      params: { spaceId: "abc" },
    });
  });

  test("sin espacio no navega", () => {
    const navigation = { navigate: jest.fn() };
    openSpaceOnMap(navigation, null);
    expect(navigation.navigate).not.toHaveBeenCalled();
  });
});
