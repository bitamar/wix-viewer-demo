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

// Adding a default onChange to all inputs, so the worker will have
// access to input values. Doing this after the "init" postMessage,
// because it's unable to send functions.
function setDefaultEvents(structure: StructureApi, worker: Worker) {
  const inputs = structure.getItemsByType("Input");
  inputs.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.onChange = ({ currentTarget }) => {
      const { value } = currentTarget;

      structure.setData(item.id, "data", { value });

      worker.postMessage({
        command: "setData",
        id: item.id,
        data: item.data,
      });
    };
  });
}

export default function (
  siteBaseUrl: string,
  structure: StructureApi,
): Promise<void> {
  const worker = new Worker("worker.js");

  worker.postMessage({
    command: "init",
    itemsMap: structure.getItems(),
    codeUrl: `${siteBaseUrl}/code.js`,
  });

  setDefaultEvents(structure, worker);

  const updateItem = (
    id: string,
    data: IncomingMessage,
    postMessage: (message: OutgoingMessage) => void,
  ) => {
    const commands: { [key: string]: () => void } = {
      setData: () => {
        structure.setData(id, "data", data.overrideData);
      },
      setLayout: () => {
        structure.setData(id, "layout", data.overrideLayout);
      },
      setOnClick: () => {
        structure.setEventListener(id, "onClick", () => {
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
    worker.onmessage = ({ data }: { data: IncomingMessage }) => {
      console.log("worker to main:", data.command);

      if (data.command === "userCodeRan") {
        resolve();
        return;
      }

      // TODO: convert selector to ID in structure api.
      updateItem(data.selector.substring(1), data, (message) => {
        worker.postMessage(message);
      });
    };
  });
}
