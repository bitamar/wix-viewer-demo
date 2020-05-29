/* eslint-disable no-console,@typescript-eslint/no-unused-vars */

// structureMap keeps track of everything $w need to return from getters.
let structureMap = new Map();
const callbacks = [];

// noinspection JSUnusedLocalSymbols
function $w(selector) {
  const elementId = selector.substring(1);

  const structure = structureMap.get(elementId);
  console.log(structure);
  // if (!elementAttributes) return undefined;

  return {
    set text(text) {
      structure.text = text;
      postMessage({ command: "setText", selector, value: text });
    },

    get text() {
      return structure ? structure.text : undefined;
    },

    set src(url) {
      structure.src = url;
      postMessage({ command: "setSrc", selector, value: url });
    },

    get src() {
      return structure ? structure.src : undefined;
    },

    onClick(callback) {
      const callbackKey = callbacks.length;
      callbacks.push(callback);
      postMessage({ command: "setOnClick", selector, value: callbackKey });
    },
  };
}

// eslint-disable-next-line no-restricted-globals
self.onmessage = ({ data }) => {
  console.log("main to userCode", data);

  switch (data.command) {
    case "runCode":
      fetch(data.url)
        .then((response) => response.text())
        // eslint-disable-next-line no-eval
        .then((response) => eval(response));
      break;

    case "callback":
      callbacks[data.callbackId]();
      break;

    case "setStructure":
      structureMap = data.structureMap;
      break;

    default:
      console.log(`unknown command ${data.command}`);
  }
};
