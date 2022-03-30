import { JSDOM } from "jsdom";
import fs from "fs/promises";
import { fetch, BASE, normalizeName } from "../../utils";
import type { Ship } from "../ship";
import SkinPage from "./SkinPage";
import path from "path";
import SkinCard from "./SkinCard";
import { SkinCategories, SkinCategoryValue } from "./SkinPage/SkinPage.types";

const SKINS_PAGE = BASE + "/" + "/wiki/Skins";
const PATH_TO_SKINS_JSON = path.resolve(__dirname, "..", "..", "..", "dist/ships.json");

let _ShipSkinReader;
type ShipSkinReaderProps = {
  doc: Document;
  shipList: Ship[];
};

class ShipSkinReader {
  skinToCategory: Record<string, Map<string, SkinCategoryValue>> = {};
  /**
   * Skin on gallery doesn't match skin on skin page.
   */
  inconsistencies: string[];
  /**
   * No point of one of these bad boys without a page of skins and a list of ships.
   * Run this function to get an instance.
   * @returns ShipSkinUpdater
   */
  static async initialize() {
    const page = await fetch(SKINS_PAGE, "skins.html");
    const shipListJson = await fs.readFile(PATH_TO_SKINS_JSON, "utf-8");

    return new ShipSkinReader({
      doc: new JSDOM(page).window.document,
      shipList: JSON.parse(shipListJson),
    });
  }

  constructor(props: ShipSkinReaderProps) {
    const skinPage = new SkinPage({
      doc: props.doc,
      notJustLimited: true,
    });

    props.shipList.forEach((ship, currIndex, origArr) => {
      // Get each ships skins that were found on the Skins page.
      const shipName = normalizeName(ship.names.en);
      this.skinToCategory[shipName] = new Map();
      this.skinToCategory[shipName].set("Default", SkinCategories.Default);
      const skinsForShip = skinPage.cards.filter(
        (sk) => normalizeName(sk.boatName) === normalizeName(shipName)
      );

      if (skinsForShip.length === 0) {
        // Ship has no skins.
        return;
      }
      /**
       * `skinsForShip` is the skins on /Skins page based on the shipName found on the element.
       * Skin name can be different from Gallery if it's Retrofit, Wedding, Unobtainable, or if it's just wrong.
       */

      for (const skinPageSkin of skinsForShip) {
        let standardizedSkinName = skinPageSkin.skinName;
        if (skinPageSkin.isRetrofit || skinPageSkin.isWedding || skinPageSkin.isOriginalArt) {
          // Can't match up by name if ^
          standardizedSkinName = skinPageSkin.isRetrofit
            ? "Retrofit"
            : skinPageSkin.isWedding
            ? "Wedding"
            : "Original Art";
        }
        /**
         * If not -1, this skin in this ship in the shipList needs to be assigned the skinPageSkin's category.
         */
        const skinToUpdate = ship.skins.findIndex(
          (x) => normalizeName(x.name) === normalizeName(standardizedSkinName)
        );

        if (skinToUpdate === -1) {
          // Can't find skin name. I.E. skins don't match.
          const galleryNames = ship.skins.map((s) => s.name);
          console.error(
            "Inconsistant name!",
            standardizedSkinName,
            `Skin Gallery Names: ${galleryNames}`
          );
          return;
        }
        this.skinToCategory[shipName].set(
          normalizeName(ship.skins[skinToUpdate].name),
          skinPageSkin.skinCategory
        );
        // origArr[currIndex].skins[skinToUpdate].info.category = skinPageSkin.skinCategory;
      }
    });
  }
  // find(_name: string) {
  //   const skinName = normalizeName(_name);
  //   if (knownInconsistencies.includes(skinName))
  // }
}

export default ShipSkinReader;
