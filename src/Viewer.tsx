/* eslint-disable no-console */

import React, { useEffect, useState } from "react";
import Renderer, { Item, itemId } from "./Renderer";
import logError from "./error";

type UserCodeMessage = {
  command: "setText" | "setSrc" | "setOnClick";
  selector: string;
  value: string;
};

function copyItem(oldItem: Item): Item {
  return {
    ...oldItem,
    data: { ...oldItem.data },
    layout: { ...oldItem.layout },
  };
}

type ItemsMap = Map<string, Item>;
function itemsReducer(
  itemsMap: ItemsMap,
  message: UserCodeMessage,
  callbackMessage: (callbackId: string) => void,
): ItemsMap {
  const key = message.selector.substring(1);
  const item = itemsMap.get(key);
  if (!item) return itemsMap;

  const newItem = copyItem(item);

  switch (message.command) {
    case "setText":
      newItem.data.text = message.value;
      break;

    case "setSrc":
      newItem.data.src = message.value;
      break;

    case "setOnClick":
      newItem.data.onClick = () => callbackMessage(message.value);
      break;

    default:
      logError("no such command", message.command);
  }

  // TODO: This overrides the previous itemsMap.
  itemsMap.set(key, newItem);
  console.log(itemsMap);
  return itemsMap;
}

type Props = { items: Item[] };
export default function ({ items }: Props): JSX.Element {
  console.log("Viewer");

  const [itemsMap, setItemsMap] = useState(
    new Map(items.map((item) => [itemId(item), item])),
  );

  const [waitingForUserCode, setWaitingForUserCode] = useState(true);

  // TODO: Hack for creating the worker once. How this should be done?
  const [worker] = useState(new Worker("worker.js"));

  useEffect(() => {
    console.log("Viewer starting worker");

    const callbackMessage = (callbackId: string) => {
      worker.postMessage({ command: "callback", callbackId });
    };

    worker.onmessage = ({ data }) => {
      console.log("worker to main", data);

      if (data.command === "userCodeRan") setWaitingForUserCode(false);
      else setItemsMap(itemsReducer(itemsMap, data, callbackMessage));
    };

    worker.postMessage({
      command: "init",
      itemsMap,
      codeUrl: "http://localhost:3000/code.js",
    });
  }, [itemsMap, worker]);

  if (waitingForUserCode) return <div className="loading" />;

  return <Renderer items={Array.from(itemsMap.values())} />;
}
