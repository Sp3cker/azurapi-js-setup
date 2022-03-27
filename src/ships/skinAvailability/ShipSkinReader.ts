import { JSDOM } from "jsdom";
import fs from "fs/promises";
import { fetch, BASE, normalizeName } from "../../utils";
import type { Ship } from "../ship";
import SkinPage from "./SkinPage";
import path from "path";

const SKINS_PAGE = BASE + "/" + "/wiki/Skins";
const PATH_TO_SKINS_JSON = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "dist/ships.json"
);

type ShipSkinReaderProps = {
  doc: Document;
  shipList: Ship[];
};

class ShipSkinReader {
  shipList: Ship[];

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
    this.shipList = props.shipList;
    const limitedSkins = new SkinPage({
      doc: props.doc,
      notJustLimited: true,
    }); //.findNamesInCards();
    console.log(limitedSkins)
    // this.shipList.forEach((ship) => {
    //   // Get each ships skins that were found on the Skins page.
    //   const thisBoatsLimitedSkins = limitedSkins.filter(
    //     (sk) => normalizeName(sk.boatName) === normalizeName(ship.names.en)
    //   );

    //   if (thisBoatsLimitedSkins.length === 0) {
    //     // Ship had no limited skins.
    //     return;
    //   }
    //   for (const ltdSkin of thisBoatsLimitedSkins) {
    //     const skinToUpdate = ship.skins.findIndex(
    //       (x) => normalizeName(x.name) === normalizeName(ltdSkin.skinName)
    //     );
    //     if (skinToUpdate === -1) {
    //       // Can't find skin name. I.E. skins don't match.
    //       const galleryNames = ship.skins.map((s) => s.name);
    //       console.error(
    //         "Inconsistant name!",
    //         thisBoatsLimitedSkins,
    //         ship.skins[0].name
    //       );
    //       return;
    //       // throw new Error(`
    //       //   Limited skin found for ship: ${ship.names.en},
    //       //   but skin names don't match - stopping.`);
    //     }
    //     this.shipList[this.shipList.indexOf(ship)].skins[
    //       skinToUpdate
    //     ].info.limited = true;
    //   }
    // });
  }
}

export default ShipSkinReader;
