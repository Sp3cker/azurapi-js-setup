import { BaseSkinCardStrategy, isDiv } from "./BaseStrategy";

/**
 * Not currently implemented anywhere.
 */
class FindLimitedSkinsStrategy extends BaseSkinCardStrategy {
  constructor() {
    super();
  }

  findCards(doc: Document): HTMLDivElement[] {
    const cards: HTMLDivElement[] = [];
    doc.querySelectorAll("img[alt='LIMITED.png']").forEach((card) => {
      const closetShipcard = card.closest("div.azl-shipcard");
      if (!isDiv(closetShipcard)) {
        throw new Error("No div found around here");
      }
      cards.push(closetShipcard);
    });
    if (cards.length === 0) {
      throw new Error("No cards found on page :(");
    }
    return cards;
  }
}

export default FindLimitedSkinsStrategy;
