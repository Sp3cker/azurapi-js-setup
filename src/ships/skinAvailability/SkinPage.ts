import { keepIfInEnum } from "../../utils";
import { SkinCategories } from "./SkinPage/SkinPage.types";
import { BaseSkinCardStrategy, ShipCardParseError } from "./SkinPage/strategies/BaseStrategy";
import SkinCard from "./SkinCard";
import FindAllSkinsStrategy from "./SkinPage/strategies/FindAllSkinsStrategy";

type Props = {
  doc: Document;
  notJustLimited: boolean;
};

/**
 * Give me the Skins page parsed with JSDOM.
 */
class SkinPage {
  /**
   * Array of all the skins I could find on the Skins page.
   */
  cards: SkinCard[] = [];
  findCardsStrategy: BaseSkinCardStrategy;
  categories: Set<string> = new Set();

  constructor({ doc }: Props) {
    this.checkCategories(doc);
    this.findCardsStrategy = new FindAllSkinsStrategy();

    this.cards = this.findCardsStrategy.findCards(doc).map(SkinCard.initialize);
    // this.cards.forEach((c) => this.categories.add(c.skinCategory));
  }

  /**
   *
   * @returns LimitedSkinModel[]
   */
  findNamesInCards() {
    if (this.cards.length === 0) {
      throw new Error("Gotta load the skins first, pal.");
    }
  }

  checkCategories(doc: Document) {
    doc.querySelectorAll("article").forEach((tabber) => {
      const heading = tabber.getAttribute("title");
      if (!keepIfInEnum(heading, SkinCategories)) {
        throw new ShipCardParseError(`New or unknown skin category: ${heading}`, tabber);
      }
    });
  }
}

export default SkinPage;
