import React from "react";
import ReactDom from "react-dom";
import Renderer from "./Renderer";
import initWorker from "./user-code";
import { Items } from "./types";

import "./index.css";

async function fetchJson<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return response.json();
}

// TODO: Allow to re-render only a single element, instead of the entire tree.
function render(itemsMap: Items) {
  ReactDom.render(
    <Renderer items={Object.values(itemsMap)} />,
    document.getElementById("root"),
  );
}

(async () => {
  const url = "http://localhost:3000/structure.json";
  const itemsMap = await fetchJson<Items>(url);

  const hasUserCode = true;
  if (hasUserCode) initWorker(itemsMap, render);
  else render(itemsMap);
})();
