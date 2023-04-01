import { createSignal } from "solid-js";
import { mpDom, MpRootElement } from "solid-mp-vdom";
import { render } from "solid-mp-vdom-renderer";
import { View, Text } from "../../vdom-comp";
import { eventHandler } from "../../shared";
import "./index.css";

function PageComp(props: any = {}) {
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

function PureComp() {
  return (
    <mp-view>
      <mp-text>Hello World from Solid!</mp-text>
    </mp-view>
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
  rootEl: null as MpRootElement | null,
  onLoad(_query) {
    const rootEl = (this.rootEl = mpDom.createElement("root"));
    rootEl._page = this;
    mpDom.insertBefore(rootEl);

    rootEl.addEventListener("tap", (e) => {
      console.log("document onTap", e);
    });

    render(() => (<PageComp />) as any, rootEl);
  },
  onUnload() {
    mpDom.removeChild(this.rootEl!);
    this.rootEl!._page = null;
    this.rootEl = null;
  },
  eh: eventHandler,
});
