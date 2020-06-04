import React from "react";
import ReactDom from "react-dom";

import Renderer from "./Renderer";
import userCode from "./user-code";
import { Items, Rerender, Rerenders } from "./types";

import logError from "./error";

import "./index.css";

async function fetchJson<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return response.json();
}

const rerender: Rerender = (() => {
  const renderers: Rerenders = {};

  return {
    add: (id: string, renderer: () => void) => {
      renderers[id] = renderer;
    },
    rerender: (id: string) => {
      if (!renderers[id]) {
        logError("no rerenderer for id", id);
        return;
      }

      renderers[id]();
    },
  };
})();

function render(items: Items) {
  ReactDom.render(
    <Renderer items={Object.values(items)} rerender={rerender} />,
    document.getElementById("root"),
  );
}

(async () => {
  const url = "http://localhost:3000/structure.json";
  const items = await fetchJson<Items>(url);

  // Don't render anything before first userCode run, to avoid re-rendering
  // on each worker set command.
  await userCode(items, rerender);

  render(items);
})();
