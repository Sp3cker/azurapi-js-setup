import {
  BaseSkinCardStrategy,
  isDiv,
  ShipCardParseError,
} from "./BaseStrategy";

class FindAllSkinsStrategy extends BaseSkinCardStrategy {
  constructor() {
    super();
  }
  findCards(doc: Document): HTMLDivElement[] {
    const cards: HTMLDivElement[] = [];
    doc.querySelectorAll("div.azl-shipcard").forEach((card) => {
      if (!isDiv(card)) return;
      cards.push(card);
    });
    if (cards.length === 0) {
      throw new ShipCardParseError("Error parsing skin cards - none found!");
    }
    return cards;
  }
}

export default FindAllSkinsStrategy;
