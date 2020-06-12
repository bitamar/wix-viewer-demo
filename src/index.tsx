import React from "react";
import ReactDom from "react-dom";

import Renderer from "./Renderer";
import userCode from "./user-code";
import initWindowMessages from "./window-messages";
import { Items } from "./types";
import structureApi from "./structure";
import { fetchJson } from "./utils";
import initRemote from "./remote";
import "./index.css";

const urlParams = new URLSearchParams(window.location.search);
const site = urlParams.get("site") ? urlParams.get("site") : "button";
const siteBaseUrl = `/${site}`;

(async () => {
  const items = await fetchJson<Items>(`${siteBaseUrl}/structure.json`);
  const structure = structureApi(items);

  // Don't render anything before first userCode run, to avoid re-rendering
  // on each worker set command.
  await userCode(siteBaseUrl, structure);

  initRemote(structure);
  // listen to incoming messages from child windows.
  initWindowMessages(structure);

  ReactDom.render(
    <Renderer structure={structure} />,
    document.getElementById("root"),
  );
})();
