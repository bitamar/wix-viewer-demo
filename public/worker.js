/* eslint-disable no-console */

console.log("worker.js");

// structureMap keeps track of everything $w need to return from getters.
let itemsMap = new Map();
const callbacks = [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function $w(selector) {
  const elementId = selector.substring(1);

  const item = itemsMap[elementId];

  // noinspection JSUnusedGlobalSymbols
  return {
    set text(text) {
      item.data.text = text;
      postMessage({ command: "setText", selector, value: text });
    },

    get text() {
      return item ? item.data.text : undefined;
    },

    set src(url) {
      item.data.src = url;
      postMessage({ command: "setSrc", selector, value: url });
    },

    get src() {
      return item ? item.data.src : undefined;
    },

    onClick(callback) {
      const callbackId = callbacks.length;
      callbacks.push(callback);
      console.log("added callback #", callbackId);
      postMessage({ command: "setOnClick", selector, value: callbackId });
    },
  };
}

// eslint-disable-next-line no-restricted-globals
self.onmessage = async ({ data }) => {
  console.log("main to userCode", data);

  const commands = {
    init: () => {
      itemsMap = data.itemsMap;

      fetch(data.codeUrl)
        .then((response) => response.text())
        // eslint-disable-next-line no-eval
        .then((code) => eval(code))
        .then(() => postMessage({ command: "userCodeRan" }));
    },
    callback: () => {
      console.log("running worker callback #", data.callbackId);
      callbacks[data.callbackId]();
    },
  };
  if (!commands[data.command]) {
    console.log(`unknown command ${data.command}`);
    return;
  }
  commands[data.command]();
};
