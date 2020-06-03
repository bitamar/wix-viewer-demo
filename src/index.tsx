import React from "react";
import ReactDom from "react-dom";
import "mobx-react-lite/batchingForReactDom";
import { observable } from "mobx";

import Renderer from "./Renderer";
import initUserCode from "./user-code";
import { Items } from "./types";

import "./index.css";

async function fetchJson<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return response.json();
}

function render(items: Items) {
  ReactDom.render(
    <Renderer items={Object.values(items)} />,
    document.getElementById("root"),
  );
}

(async () => {
  const url = "http://localhost:3000/structure.json";
  const json = await fetchJson<Items>(url);
  const items = observable(json);

  // Don't render anything before first userCode run, to avoid re-rendering
  // on each worker set command.
  await initUserCode(items);

  render(items);
})();
