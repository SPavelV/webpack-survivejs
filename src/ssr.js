const React = require("react");
const ReactDom = require("react-dom");
const SSR = <div onClick={() => alert("Hello")}>Hello world</div>;

// Render only in the browser, export otherwise
if (typeof document === "undefined") {
  module.exports = SSR;
} else {
  ReactDom.hydrate(SSR, document.getElementById("app"));
}
