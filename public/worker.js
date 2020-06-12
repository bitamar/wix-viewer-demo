let itemsMap = {};
const callbacks = [];

function buttonSdk(item, selector) {
  return {
    onClick(callback) {
      const callbackId = callbacks.length;
      callbacks.push(callback);
      postMessage({ command: "setOnClick", selector, callbackId });
    },

    set text(text) {
      item.data.text = text;
      postMessage({ command: "setData", selector, overrideData: { text } });
    },
  };
}

function imageSdk(item, selector) {
  return {
    set src(src) {
      item.data.src = src;
      postMessage({ command: "setData", selector, overrideData: { src } });
    },

    get src() {
      return item.data.src;
    },
  };
}

function inputSdk(item) {
  return {
    get value() {
      return item.data.value;
    },
  };
}

function textSdk(item, selector) {
  return {
    set text(text) {
      item.data.text = text;
      postMessage({ command: "setData", selector, overrideData: { text } });
    },

    get text() {
      return item.data.text;
    },
  };
}

function iframeSdk(item, selector) {
  return {
    set params(params) {
      item.data.params = params;
      postMessage({ command: "setData", selector, overrideData: { params } });
    },
  };
}

const componentSdks = {
  Button: buttonSdk,
  Image: imageSdk,
  Input: inputSdk,
  Text: textSdk,
  Iframe: iframeSdk,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function $w(selector) {
  const elementId = selector.substring(1);
  const item = itemsMap[elementId];
  if (!item) return null;

  return componentSdks[item.type](item, selector);
}

// eslint-disable-next-line no-restricted-globals
self.onmessage = async ({ data: message }) => {
  console.log("main to userCode:", message.command);

  const commands = {
    init: () => {
      itemsMap = message.itemsMap;

      fetch(message.codeUrl)
        .then((response) => response.text())
        // eslint-disable-next-line no-eval
        .then((code) => eval(code))
        .then(() => postMessage({ command: "userCodeRan" }));
    },
    setData: () => {
      Object.assign(itemsMap[message.id].data, message.data);
    },
    callback: () => {
      callbacks[message.callbackId]();
    },
  };
  commands[message.command]();
};
