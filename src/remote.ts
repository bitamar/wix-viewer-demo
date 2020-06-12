import { StructureApi } from "./types";

export default function (structure: StructureApi): void {
  structure.getItemsByType("Remote").forEach((item) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = item.data.src;
    document.head.appendChild(script);
  });
}
