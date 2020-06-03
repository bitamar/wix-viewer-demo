/* eslint-disable no-console */
import { toJS } from "mobx";
import { Data, Item, Items } from "./types";
import logError from "./error";

type UserCodeMessage = {
  data: {
    command: "setData" | "setOnClick" | "userCodeRan";
    selector: string;
    overrideData?: Data;
    callbackId?: string;
  };
};

export default function (itemsMap: Items): Promise<void> {
  return new Promise((resolve) => {
    const worker = new Worker("worker.js");

    worker.onmessage = ({ data }: UserCodeMessage) => {
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
      itemsMap: toJS(itemsMap),
      codeUrl: "http://localhost:3000/code.js",
    });
  });
}
