/* eslint-disable no-param-reassign,no-console */

import { Item, Items } from "./types";
import logError from "./error";

type UserCodeMessage = {
  command: "setText" | "setSrc" | "setOnClick";
  selector: string;
  value: string;
};

// eslint-disable-next-line no-param-reassign
function updateItem(
  item: Item,
  message: UserCodeMessage,
  callbackMessage: (callbackId: string) => void,
): void {
  switch (message.command) {
    case "setText":
      item.data.text = message.value;
      break;

    case "setSrc":
      item.data.src = message.value;
      break;

    case "setOnClick":
      // TODO: Not on data.
      item.data.onClick = () => callbackMessage(message.value);
      break;

    default:
      logError("no such command", message.command);
  }
}

export default function initWorker(
  itemsMap: Items,
  render: (items: Items) => void,
): void {
  const worker = new Worker("worker.js");
  const callbackMessage = (callbackId: string) => {
    worker.postMessage({ command: "callback", callbackId });
  };

  // Don't render anything before first userCode run, to re-render
  // on each worker set command.
  let userCodeRan = false;
  worker.onmessage = ({ data }) => {
    console.log("worker to main", data);

    if (data.command === "userCodeRan") userCodeRan = true;
    else {
      const key = data.selector.substring(1);
      const item = itemsMap[key];
      if (!item) return;
      updateItem(item, data, callbackMessage);
    }

    // TODO: Instead of this if, there should be a way with promises.
    if (userCodeRan) {
      // TODO: Move userCode logic to another file or function. And add hasUserCode param.
      render(itemsMap);
    }
  };

  worker.postMessage({
    command: "init",
    itemsMap,
    codeUrl: "http://localhost:3000/code.js",
  });
}
