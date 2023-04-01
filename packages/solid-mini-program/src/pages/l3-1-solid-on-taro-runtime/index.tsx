// @tarojs/runtime requires extra defines and global provides, see plugins in webpack.config.js
import { document as taroDom, TaroElement, MpEvent } from "@tarojs/runtime";
import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { View, Text } from "../../taro-comp";
import "./index.css";

function PageComp(props: any) {
  const [count, setCount] = createSignal(0);

  return (
    <View
      style="font-size: large;"
      class="mp-view-class"
      hoverClass="mp-view-hover-class"
      onTap={() => setCount(count() + 1)}
    >
      <Text>Hello World from Solid!</Text>
      <View>Tap count: {count()}</View>
    </View>
  );
}

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
  rootEl: null as any,
  onLoad(_query) {
    const rootEl = (this.rootEl = document.createElement("root"));
    (rootEl as any).ctx = this;
    document.insertBefore(rootEl, null);

    rootEl.addEventListener("tap", (e) => {
      console.log("document onTap", e);
    });

    render(() => (<PageComp />) as any, rootEl);
  },
  onUnload() {
    document.removeChild(this.rootEl!);
    this.rootEl!.ctx = null;
    this.rootEl = null;
  },
  // modified from import("@tarojs/runtime").eventHandler
  eh: function (event: MpEvent) {
    event.currentTarget = event.currentTarget || event.target || { ...event };

    const currentTarget = event.currentTarget;
    const id =
      (currentTarget.dataset?.sid as string) /** sid */ ||
      currentTarget.id /** uid */ ||
      (event.detail?.id as string) ||
      "";

    const node = taroDom.getElementById(id);
    if (!node) return;
    const e = taroDom.createEvent(event, node);
    node.dispatchEvent(e);

    // manually bubble to document, as solid-js registers event delegation listener on document
    if (!isParentBinded(node, event.type)) {
      const taroDomEl = taroDom as TaroElement;
      const e = {
        ...event,
        target: taroDom.getElementById(
          event.target.dataset?.sid || event.target.id
        ),
        currentTarget: taroDomEl,
      };
      const listeners = taroDomEl.__handlers[event.type];
      if (Array.isArray(listeners)) {
        listeners.forEach((l) => l.call(taroDomEl, e));
      }
      // taroDomEl.dispatchEvent(e);
    }
  },
});

function isParentBinded(node: TaroElement | null, type: string): boolean {
  let res = false;
  while (node?.parentElement && node.parentElement._path !== "root") {
    if (node.parentElement.__handlers[type]?.length) {
      res = true;
      break;
    }
    node = node.parentElement;
  }
  return res;
}
