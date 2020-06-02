import React from "react";
import { render } from "react-dom";
import { Item } from "./Renderer";
import Viewer from "./Viewer";

import "./index.css";

async function fetchJson<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return response.json();
}

(async () => {
  const url = "http://localhost:3000/siteStructure.json";
  const items = await fetchJson<Item[]>(url);

  // TODO: Move usercode logic here, and mock rerender from here.
  render(<Viewer items={items} />, document.getElementById("root"));
})();
