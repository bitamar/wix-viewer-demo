import { Items, Rerender } from "./types";
import logError from "./error";

type IncomingMessage = {
  command: "setData" | "setLayout" | "setOnClick" | "userCodeRan";
  selector: string;
  overrideData?: unknown;
  overrideLayout?: unknown;
  callbackId?: string;
};

type OutgoingMessage = {
  command: "callback";
  callbackId?: string;
};

export default function (itemsMap: Items, rerender: Rerender): Promise<void> {
  const updateItem = (
    id: string,
    data: IncomingMessage,
    postBack: (message: OutgoingMessage) => void,
  ) => {
    const item = itemsMap[id];
    if (!item) return;

    const commands: { [key: string]: () => void } = {
      setData: () => {
        Object.assign(item.data, data.overrideData);
      },
      setLayout: () => {
        Object.assign(item.layout, data.overrideLayout);
      },
      setOnClick: () => {
        item.onClick = () => {
          postBack({
            command: "callback",
            callbackId: data.callbackId as string,
          });
        };
      },
    };
    if (!commands[data.command]) {
      console.log(data);
      logError("no such command", data.command);
      return;
    }
    commands[data.command]();
    rerender.rerender(item.id);
  };

  return new Promise((resolve) => {
    window.addEventListener("message", ({ data, origin }) => {
      if (!data?.payload?.id) return;
      const item = itemsMap[data.payload.id];
      if (!item) return;

      // Check that data.payload.id and event.origin match, to prevent the iframe
      // from altering other elements.
      const url = new URL(item.data.src);
      if (url.origin !== origin) return;

      updateItem(item.id, data.payload, (message) => {
        window.postMessage(message, origin);
      });
    });

    const worker = new Worker("worker.js");
    worker.onmessage = ({ data }: { data: IncomingMessage }) => {
      console.log("worker to main", data);

      if (data.command === "userCodeRan") {
        resolve();
        return;
      }

      updateItem(data.selector.substring(1), data, (message) => {
        worker.postMessage(message);
      });
    };

    worker.postMessage({
      command: "init",
      itemsMap,
      codeUrl: "/code.js",
    });
  });
}
