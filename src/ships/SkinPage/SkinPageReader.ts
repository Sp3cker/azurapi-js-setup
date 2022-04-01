import { JSDOM } from "jsdom";
import fs from "fs/promises";
import { fetch, BASE } from "../../utils";
// import type { Ship } from "../ship";
import SkinPage from "./SkinPage";
// import path from "path";
const SKINS_PAGE = BASE + "/" + "/wiki/Skins";
// const PATH_TO_SKINS_JSON = path.resolve(__dirname, "..", "..", "..", "dist/ships.json");

type SkinPageReaderProps = {
  doc: Document;
  // shipList: Ship[];
};
class SkinPageReader {
  skinPage: SkinPage;

  /**
   * No point of one of these bad boys without a page of skins and a list of ships.
   * Run this function to get an instance.
   * @returns ShipSkinUpdater
   */
  static async initialize() {
    const page = await fetch(SKINS_PAGE, "skins.html");
    // const shipListJson = await fs.readFile(PATH_TO_SKINS_JSON, "utf-8");

    return new SkinPageReader({
      doc: new JSDOM(page).window.document,
      // shipList: JSON.parse(shipListJson),
    });
  }

  constructor(props: SkinPageReaderProps) {
    const skinPage = new SkinPage({
      doc: props.doc,
      notJustLimited: true,
    });
    this.skinPage = skinPage;
    console.info("[SkinPage] Loaded!");
    // props.shipList.forEach((ship) => {
    //   // Get each ships skins that were found on the Skins page.
    //   const shipName = ship.names.en.replace("\u00b5", "\u03bc").normalize("NFKC");

    //   const skinsForShip = skinPage.boatSkinMap.get(shipName);

    //   if (skinsForShip === undefined) {
    //     // Ship has no skins on /Skinpage.
    //     if (ship.skins.length === 1 || ship.skins[1].name === "Retrofit") {
    //       return;
    //     }
    //     console.error(ship.skins);
    //     throw new Error(`Baby girl ${shipName} is missing skins on Skins page`);
    //   }
    // });
  }
}

export default SkinPageReader;
