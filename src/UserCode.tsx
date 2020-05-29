import React, { useEffect } from "react";
import logError from "./error";
import { itemId, Structure } from "./Structure";

type Attributes = {
  text?: string;
  src?: string;
};

function userCodeAttributes(structure: Structure[]): Map<string, Attributes> {
  const structureAttributes = ({ data }: Structure) => ({
    text: data ? data.text : undefined,
    src: data ? data.src : undefined,
  });

  return new Map(
    structure.map((item) => [itemId(item), structureAttributes(item)]),
  );
}

type UserCodeMessage = { command: string; selector: string; value: string };

function handleUserCodeMessage(worker: Worker, data: UserCodeMessage): void {
  // Currently only selecting by the actual id.
  if (!data.selector.match(/^#\w(\w|-)*$/)) {
    logError("invalid selector", data.selector);
    return;
  }

  // TODO: only search under the root element.
  const element = document.getElementById(data.selector.substring(1));
  if (!element) {
    logError("no such element", data.selector);
    return;
  }

  switch (data.command) {
    case "setText":
      element.innerText = data.value;
      break;

    case "setSrc":
      element.setAttribute("src", data.value);
      break;

    case "setOnClick":
      element.onclick = () => {
        worker.postMessage({ command: "callback", callbackId: data.value });
      };
      break;

    default:
      logError("invalid command", data.command);
  }
}

const userCode = new Worker("worker.js");

type Props = { structure: Structure[] };

export default function UserCode({ structure }: Props): JSX.Element {
  useEffect(() => {
    const structureMap = userCodeAttributes(structure);

    userCode.onmessage = ({ data }) => {
      // eslint-disable-next-line no-console
      console.log("userCode to main", data);
      handleUserCodeMessage(userCode, data);
    };
    userCode.postMessage({ command: "setStructure", structureMap });
    userCode.postMessage({
      command: "runCode",
      url: "http://localhost:3000/code.js",
    });
  }, [structure]);

  return <></>;
}
