import React from "react";
import ReactDom from "react-dom";

import Renderer from "./Renderer";
import userCode from "./user-code";
import windowMessages from "./window-messages";
import { Items } from "./types";
import structureApi from "./structure";

import "./index.css";

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
  const url = "/structure.json";
  const items = await fetchJson<Items>(url);
  const structure = structureApi(items);

  // fetchText(data.src).then((code) => {
  // console.log(code);
  // });

  // Don't render anything before first userCode run, to avoid re-rendering
  // on each worker set command.
  windowMessages(structure);
  await userCode(structure);

  ReactDom.render(
    <Renderer structure={structure} />,
    document.getElementById("root"),
  );
})();
