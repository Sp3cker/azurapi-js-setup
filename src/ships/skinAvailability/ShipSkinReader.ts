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
    const limitedSkins = new SkinPage(props.doc).findNamesInCards();

    this.shipList.forEach((ship) => {
      // Get each ships skins that were found on the Skins page.
      const thisBoatsLimitedSkins = limitedSkins.filter(
        (sk) => normalizeName(sk.boatName) === normalizeName(ship.names.en)
      );

      if (thisBoatsLimitedSkins.length === 0) { // Ship had no limited skins.
        return;
      }


    });
  }
}

export default ShipSkinReader;
