export type SkinCardModel = {
  skinName: string;
  boatName: string;
  limited: boolean;
};

export enum SkinCategories {
  Default = "Default",
  Bluray = "Bluray",
  Bunny = "Bunny",
  Casual = "Casual",
  Christmas = "Christmas",
  Collab = "Collab",
  Festival = "Festival",
  Halloween = "Halloween",
  Hospital = "Hospital",
  Idol = "Idol",
  Maid = "Maid",
  NewYear = "New Year",
  Party = "Party",
  RaceQueen = "Race Queen",
  School = "School",
  SpecialExercise = "Special Exercise",
  Sport = "Sport",
  Spring = "Spring",
  Swimsuits = "Swimsuits",

  Miscellaneous = "Miscellaneous",
  Event = "Event",
  CollabEvent = "Collab Event",
  Retrofit = "Retrofit",
  Wedding = "Wedding",
  Unobtainable = "Unobtainable",
}
export type SkinCategoryValue = `${SkinCategories}`;
