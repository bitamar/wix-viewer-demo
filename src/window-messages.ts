import { StructureApi } from "./types";

export default function (structure: StructureApi): void {
  window.addEventListener("message", ({ data }) => {
    const { payload } = data;
    if (!payload?.id) return;

    const commands: { [key: string]: () => void } = {
      setLayout: () => {
        structure.setData(payload.id, "layout", payload.overrideLayout);
      },
    };
    commands[payload.command]();
  });
}
