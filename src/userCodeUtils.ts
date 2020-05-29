import logError from "./error";
import { itemId, Structure } from "./Structure";

type Attributes = {
  text?: string;
  src?: string;
};

export function userCodeAttributes(
  structure: Structure[],
): Map<string, Attributes> {
  const structureAttributes = ({ data }: Structure) => ({
    text: data ? data.text : undefined,
    src: data ? data.src : undefined,
  });

  return new Map(
    structure.map((item) => [itemId(item), structureAttributes(item)]),
  );
}

export function handleUserCodeMessage(
  worker: Worker,
  data: { command: string; selector: string; value: string },
): void {
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
