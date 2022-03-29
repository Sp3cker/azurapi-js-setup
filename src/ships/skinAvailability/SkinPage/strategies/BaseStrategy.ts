import { keepIfInEnum } from "../../../../utils";
import {
  SkinCardModel,
  SkinCategories,
  SkinCategoryValue,
} from "../SkinPage.types";


export const isDiv = (e: Element | null): e is HTMLDivElement => {
  return e !== null && e.tagName === "DIV";
};

const Unobtainable = new RegExp("Unobtainable", "m");
export const findClosestCategory = (card: Element) => {
  const cat = card.closest("article");
  if (cat === null) {
    const cardBottom = card.querySelector(".alc-bottom").textContent;
    if (Unobtainable.test(cardBottom)) {
      return;
    }
    console.error(card.innerHTML);
    throw "fug";
  }
  const catTitle = cat.getAttribute("title").trim();
  const keptCat = keepIfInEnum(catTitle, SkinCategories);
  if (keptCat === undefined) {
    throw new ShipCardParseError("Could not find category for ship card", card);
  }
  return keptCat;
};

/**
 * Using a fancy-pants strategy because
 *  we could extend this if we get imaginative.
 * If all cards or just limited, or maybe even non-limited in the future
 */
export abstract class BaseSkinCardStrategy {
  constructor() {}

  /**
   * This function should traverse the skins page and return shipcards.
   * Like the whole element. <div class="azl-shipcard".../> yada yda
   * @param doc The Skins page
   */
  abstract findCards(doc: Document): HTMLDivElement[];
}

export class ShipCardParseError extends Error {
  // syntactic sugar to set these to this automatically
  constructor(readonly message: string, readonly badCard?: Element) {
    super();
    this.name = "Error Parsing Ship Skin Cards";
  }
}
