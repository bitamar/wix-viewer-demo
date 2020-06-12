// AMD / UMD .
/***/ (function (module, exports, __webpack_require__) {
  __webpack_require__.r(__webpack_exports__);
  /* harmony import */
  var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! react */ "./node_modules/react/index.js",
  );
  /* harmony import */
  var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
    react__WEBPACK_IMPORTED_MODULE_0__,
  );

  function SomeRemote({ data }) {
    console.log("React rendering SomeRemote");
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      "span",
      {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 55,
          columnNumber: 10,
        },
      },
      data.text,
    );
  }
});
