import type { BaseSkinCardStrategy } from "./SkinPage/BaseStrategy";
import FindAllSkinsStrategy from "./SkinPage/FindAllSkinsStrategy";
import FindLimitedSkinsStrategy from "./SkinPage/FindLimitedSkinsStrategy";

type LimitedSkinModel = {
  skinName: string;
  boatName: string;
  limited: boolean;
};
type Props = {
  doc: Document;
  notJustLimited: boolean;
};

/**
 * Give me the Skins page parsed with JSDOM.
 */
class SkinPage {
  limitedCards: HTMLDivElement[] = [];
  limitedSkins: LimitedSkinModel[] = undefined;
  strategy: BaseSkinCardStrategy;

  /** Ok, we're gonna find all the shipcards with the LIMITED img referenced in em. */
  constructor({ doc, notJustLimited }: Props) {
    this.strategy = notJustLimited
      ? new FindAllSkinsStrategy()
      : new FindLimitedSkinsStrategy();
    this.limitedCards = this.strategy.findCards(doc);
  }
  /**
   *
   * @returns LimitedSkinModel[]
   */
  findNamesInCards() {
    if (this.limitedCards.length === 0) {
      throw new Error("Gotta load the skins first, pal.");
    }
    return this.limitedCards.map(this.findNamesInCard);
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
      limited: true,
    };
  }
}

export default SkinPage;
