type LimitedSkinModel = {
  skinName: string;
  boatName: string;
  limited: boolean;
};

const isDiv = (e: Element | null): e is HTMLDivElement => {
  return e !== null && e.tagName === "DIV";
};
/**
 * Give me the Skins page parsed with JSDOM.
 */
class SkinPage {
  limitedCards: HTMLDivElement[] = [];
  limitedSkins: LimitedSkinModel[] = undefined;

  /** Ok, we're gonna find all the shipcards with the LIMITED img referenced in em. */
  constructor(doc: Document) {
    doc.querySelectorAll("img[alt='LIMITED.png']").forEach((card) => {
      if (!card.parentElement || card.parentElement.className !== "tooltip") {
        return;
      }

      const closetShipcard = card.closest("div.azl-shipcard");
      if (!isDiv(closetShipcard)) {
        throw new Error("No div found around here");
      }
      this.limitedCards.push(closetShipcard);
    });
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
