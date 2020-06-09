import { Item, Items, Rerender } from "./types";
import logError from "./error";

type IncomingMessage = {
  command: "setData" | "setOnClick" | "userCodeRan";
  selector: string;
  overrideData?: unknown;
  callbackId?: string;
};

export default function (itemsMap: Items, rerender: Rerender): Promise<void> {
  return new Promise((resolve) => {
    window.addEventListener("message", ({ data, origin }) => {
      if (!data?.payload?.id) return;
      const item = itemsMap[data.payload.id];
      if (!item) return;

      // Check that data.payload.id and event.origin match, to prevent the iframe
      // from altering other elements.
      const url = new URL(item.data.src);
      if (url.origin !== origin) return;

      // TODO: Combine this as setLayout with the worker commands below.
      if (!data?.payload?.overrideLayout) return;

      Object.assign(item.layout, data.payload.overrideLayout);
      rerender.rerender(item.id);
    });

    const worker = new Worker("worker.js");
    worker.onmessage = ({ data }: { data: IncomingMessage }) => {
      console.log("worker to main", data);

      const getItem = (): Item => {
        const key = data.selector.substring(1);
        return itemsMap[key];
      };

      const commands = {
        setData: () => {
          const item = getItem();
          if (!item) return;

          Object.assign(item.data, data.overrideData);
          rerender.rerender(item.id);
        },
        setOnClick: () => {
          const item = getItem();
          if (!item) return;

          item.onClick = () => {
            worker.postMessage({
              command: "callback",
              callbackId: data.callbackId,
            });
          };
          rerender.rerender(item.id);
        },
        userCodeRan: () => resolve(),
      };
      if (!commands[data.command]) {
        logError("no such command", data.command);
        return;
      }
      commands[data.command]();
    };

    worker.postMessage({
      command: "init",
      itemsMap,
      codeUrl: "/code.js",
    });
  });
}
