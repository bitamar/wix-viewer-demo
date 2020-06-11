import React from "react";
import ReactDom from "react-dom";

import Renderer from "./Renderer";
import userCode from "./user-code";
import windowMessages from "./window-messages";
import { Items } from "./types";
import structureApi from "./structure";

import "./index.css";

const urlParams = new URLSearchParams(window.location.search);
const site = urlParams.get("site") ? urlParams.get("site") : "button";
const siteBaseUrl = `/${site}`;

async function fetchJson<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return response.json();
}

//
// async function fetchText(request: RequestInfo): Promise<string> {
//   const response = await fetch(request);
//   return response.text();
// }

(async () => {
  const items = await fetchJson<Items>(`${siteBaseUrl}/structure.json`);
  const structure = structureApi(items);

  // fetchText(data.src).then((code) => {
  // console.log(code);
  // });

  // Don't render anything before first userCode run, to avoid re-rendering
  // on each worker set command.
  await userCode(siteBaseUrl, structure);

  // listen to incoming messages from child windows.
  windowMessages(structure);

  ReactDom.render(
    <Renderer structure={structure} />,
    document.getElementById("root"),
  );
})();
