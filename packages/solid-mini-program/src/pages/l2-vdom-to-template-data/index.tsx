import { mpDom, MpRootElement, mpNodeTreeToData } from "solid-mp-vdom";
import { eventHandler } from "../../shared";

Page({
  data: {
    root: {
      cn: [
        {
          nn: "8",
          v: "Data not set yet",
        },
      ],
    },
  },
  rootEl: null as MpRootElement | null,
  onLoad(_query) {
    const rootEl = (this.rootEl = mpDom.createElement("root"));
    rootEl._page = this;
    mpDom.insertBefore(rootEl);

    const child = mpDom.createElement("view");
    rootEl.insertBefore(child);
    child.setAttribute("style", "font-size: xxx-large");
    child.setAttribute("class", "mp-class-name");
    child.setAttribute("hoverClass", "mp-view-hover-class-name");

    const helloText = "Hello World from VDOM!";
    const text = mpDom.createTextNode(helloText);
    child.insertBefore(text);

    rootEl._logTree();

    const rootData = mpNodeTreeToData(rootEl);
    console.log(rootData);
    this.setData({
      root: rootData,
    });

    child.addEventListener("tap", function () {
      if (text.data == helloText) {
        text.data = "Changed!";
      } else {
        text.data = helloText;
      }
    });
  },
  onUnload() {
    mpDom.removeChild(this.rootEl!);
    this.rootEl!._page = null;
    this.rootEl = null;
  },
  eh: eventHandler,
});
