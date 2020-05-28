import React, { useEffect, useState } from "react";
import { Structure, getComponent } from "./Structure";

// Fetch json with specific type.
export async function fetchJson<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return await response.json();
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

  const elements = structure.map((item, i) => {
    const Component = getComponent(item.type);
    if (Component) return <Component key={i} structure={item} />;
  });

  return <>{elements}</>;
}
