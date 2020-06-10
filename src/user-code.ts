import { Items, Rerender } from "./types";

type IncomingMessage = {
  command: "setData" | "setLayout" | "setOnClick" | "userCodeRan";
  selector: string;
  overrideData?: unknown;
  overrideLayout?: unknown;
  callbackId?: string;
};

type OutgoingMessage = {
  command: "callback" | "setData";
  callbackId?: string;
  overrideData?: unknown;
};

export default function (itemsMap: Items, rerender: Rerender): Promise<void> {
  const updateItem = (
    id: string,
    data: IncomingMessage,
    postMessage: (message: OutgoingMessage) => void,
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
          postMessage({
            command: "callback",
            callbackId: data.callbackId as string,
          });
        };
      },
    };
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

    // Adding a default onChange to all inputs, so the worker will have
    // access to input values. Doing this after the "init" postMessage,
    // because it's unable to send functions.
    const inputs = Object.values(itemsMap).filter(
      (item) => item.type === "Input",
    );
    inputs.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.onChange = ({ currentTarget }) => {
        const { value } = currentTarget;

        // TODO: Unify with updateItem.
        // eslint-disable-next-line no-param-reassign
        item.data.value = value;
        worker.postMessage({
          command: "setData",
          id: item.id,
          data: item.data,
        });
        rerender.rerender(item.id);
      };
    });
  });
}
