import { keepIfInEnum } from "../../utils";
import { SkinCategories } from "./SkinPage/SkinPage.types";
import {
  BaseSkinCardStrategy,
  ShipCardParseError,
  findClosestCategory,
} from "./SkinPage/strategies/BaseStrategy";
import FindAllSkinsStrategy from "./SkinPage/strategies/FindAllSkinsStrategy";
import FindLimitedSkinsStrategy from "./SkinPage/strategies/FindLimitedSkinsStrategy";

type LimitedSkinModel = {
  skinName: string;
  boatName: string;
  limited?: boolean;
};
type Props = {
  doc: Document;
  notJustLimited: boolean;
};

/**
 * Give me the Skins page parsed with JSDOM.
 */
class SkinPage {
  cards: HTMLDivElement[] = [];
  limitedSkins: LimitedSkinModel[] = undefined;
  findCardsStrategy: BaseSkinCardStrategy;

  constructor({ doc, notJustLimited }: Props) {
    this.checkCategories(doc);
    this.findCardsStrategy = notJustLimited
      ? new FindAllSkinsStrategy()
      : new FindLimitedSkinsStrategy();
    this.cards = this.findCardsStrategy.findCards(doc);
  }
  /**
   *
   * @returns LimitedSkinModel[]
   */
  findNamesInCards() {
    if (this.cards.length === 0) {
      throw new Error("Gotta load the skins first, pal.");
    }
    return this.cards.map(this.findNamesInCard);
  }

  findNamesInCard(card: HTMLDivElement): LimitedSkinModel {
    const boatName = card.querySelector("div.alc-top > a");
    const skinName = card.querySelector("div.alc-bottom > a > b");

    if (!boatName || !boatName.textContent) {
      console.error(boatName);
      throw new Error("Could not find boat name on a card");
    }
    if (!skinName || !skinName.textContent) {
      throw new Error("Could not find skin name on a card");
    }
    return {
      boatName: boatName.textContent,
      skinName: skinName.textContent,
    };
  }
  checkCategories(doc: Document) {
    doc.querySelectorAll("article").forEach((tabber) => {
      const heading = tabber.getAttribute("title");
      if (!keepIfInEnum(heading, SkinCategories)) {
        throw new ShipCardParseError(
          `New or unknown skin category: ${heading}`,
          tabber
        );
      }
    });
  }
  assignCategories() {
    // 'Event' category needs work to find it's actual category - like get the closest h3 or something
    return this.cards.map(findClosestCategory);
  }
}

export default SkinPage;
