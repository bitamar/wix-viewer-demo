import { StructureApi } from "./types";

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

export default function (structureApi: StructureApi): Promise<void> {
  const updateItem = (
    id: string,
    data: IncomingMessage,
    postMessage: (message: OutgoingMessage) => void,
  ) => {
    const commands: { [key: string]: () => void } = {
      setData: () => {
        structureApi.setData(id, "data", data.overrideData);
      },
      setLayout: () => {
        structureApi.setData(id, "layout", data.overrideLayout);
      },
      setOnClick: () => {
        structureApi.setEventListener(id, "onClick", () => {
          postMessage({
            command: "callback",
            callbackId: data.callbackId as string,
          });
        });
      },
    };
    commands[data.command]();
  };

  return new Promise((resolve) => {
    window.addEventListener("message", ({ data }) => {
      const { payload } = data;
      if (!payload?.id) return;

      structureApi.setData(payload.id, "layout", payload.overrideLayout);
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
      itemsMap: structureApi.getItems(),
      codeUrl: "/code.js",
    });

    // Adding a default onChange to all inputs, so the worker will have
    // access to input values. Doing this after the "init" postMessage,
    // because it's unable to send functions.
    const inputs = Object.values(structureApi.getItems()).filter(
      (item) => item.type === "Input",
    );
    inputs.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.onChange = ({ currentTarget }) => {
        const { value } = currentTarget;

        structureApi.setData(item.id, "data", { value });

        worker.postMessage({
          command: "setData",
          id: item.id,
          data: item.data,
        });
      };
    });
  });
}
