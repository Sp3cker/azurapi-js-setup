import { keepIfInEnum, normalizeName } from "../../utils";
import { NonGatedSkinNames, SkinCategories } from "./SkinPage.types";
import { BaseSkinCardStrategy } from "./strategies/BaseStrategy";
import SkinCard from "./SkinCard";
import FindAllSkinsStrategy from "./strategies/FindAllSkinsStrategy";
import { knownBad } from "./knownBad";

type Props = {
  doc: Document;
  notJustLimited: boolean;
};
type BoatSkinMap = Map<string, SkinCategories>;
/**
 * Give me the Skins page parsed with JSDOM.
 */
class SkinPage {
  /**
   * Array of all the skins I could find on the Skins page.
   */
  private cards: SkinCard[] = [];
  findCardsStrategy: BaseSkinCardStrategy;
  categories: Set<string> = new Set();
  boatSkinMap = new Map<string, BoatSkinMap>();

  /**
   *
   */
  constructor({ doc }: Props) {
    this.checkCategories(doc);
    this.findCardsStrategy = new FindAllSkinsStrategy();

    this.cards = this.findCardsStrategy.findCards(doc).map(SkinCard.initialize);
    this.cards.forEach((c) => {
      const boatName = normalizeName(c.boatName);
      const category = c.skinCategory;
      let standardizedSkinName = normalizeName(c.skinName);

      if (c.isRetrofit || c.isWedding || c.isOriginalArt) {
        // Can't match up by name if ^
        standardizedSkinName =
          c.skinName === NonGatedSkinNames.Default
            ? NonGatedSkinNames.Default
            : c.isRetrofit
            ? NonGatedSkinNames.Retrofit
            : c.isWedding
            ? NonGatedSkinNames.Wedding
            : NonGatedSkinNames.OriginalArt;
      }

      if (this.boatSkinMap.has(boatName)) {
        const bEntry = this.boatSkinMap.get(boatName);
        bEntry.set(standardizedSkinName, category);
        this.boatSkinMap.set(boatName, bEntry);
      } else {
        const skinToCategory = new Map([[standardizedSkinName, category]]);
        this.boatSkinMap.set(boatName, skinToCategory);
      }
      // Sinse skin page is missing a few skins, polyfill them.
      for (const missingSkin of knownBad) {
        if (boatName === missingSkin.boatName) {
          const bEntry = this.boatSkinMap.get(boatName);
          missingSkin.skins.forEach((s) => bEntry.set(s.skinName, s.category as SkinCategories));
          this.boatSkinMap.set(boatName, bEntry);
        }
      }
    });
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
        throw new Error(`New or unknown skin category: ${heading}`);
      }
    });
  }
}

export default SkinPage;
