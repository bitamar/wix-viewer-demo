import React, { useEffect, useState } from "react";
import { Structure, getComponent } from "./Structure";
import { handleUserCodeMessage, userCodeAttributes } from "./userCodeUtils";

const userCode = new Worker("worker.js");

// Fetch json with specific type.
export async function fetchJson<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return response.json();
}

export default function Viewer(): JSX.Element {
  const [structure, setStructure] = useState<Structure[]>([]);

  useEffect(() => {
    (async () => {
      const url = "http://localhost:3000/siteStructure.json";
      const data = await fetchJson<Structure[]>(url);
      setStructure(data);
    })();
  }, []);

  useEffect(() => {
    if (!structure.length) return;
    const structureMap = userCodeAttributes(structure);

    userCode.onmessage = ({ data }) => {
      // eslint-disable-next-line no-console
      console.log("userCode to main", data);
      handleUserCodeMessage(userCode, data);
    };
    userCode.postMessage({ command: "setStructure", structureMap });
    userCode.postMessage({
      command: "runCode",
      url: "http://localhost:3000/userCode.js",
    });
  }, [structure]);

  const elements = structure.map((item) => {
    const Component = getComponent(item.type);
    return Component ? <Component key={item.id} structure={item} /> : null;
  });

  return <>{elements}</>;
}
