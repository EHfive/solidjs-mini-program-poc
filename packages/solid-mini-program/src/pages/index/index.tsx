import { createSignal, JSXElement } from "solid-js";
import { mpDom, MpRootElement } from "solid-mp-vdom";
import { render } from "solid-mp-vdom-renderer";
import { eventHandler } from "../../shared";
import { View, Button, Text, Navigator } from "../../vdom-comp";
import "./index.css";

function PageNavCard(props: {
  url: string;
  label: string;
  labelClass?: string;
  title: string;
  children: JSXElement;
}) {
  return (
    <Navigator class="h5-a box" hoverClass="is-hovered" url={props.url}>
      <View class="columns is-mobile is-vcentered">
        <View class="column is-one-fifth is-flex">
          <Text class={`tag is-flex-grow-1 ${props.labelClass}`}>
            {props.label}
          </Text>
        </View>
        <View class="column">
          <View class="title is-5">{props.title}</View>
          <View class="subtitle is-7">{props.children}</View>
        </View>
      </View>
    </Navigator>
  );
}

function Content() {
  const [count, setCount] = createSignal(0);
  return (
    <View class="container p-4">
      <View class="title">SolidJS 小程序 POC</View>
      <View class="block">
        <Button
          class="h5-button button is-primary"
          hoverClass="is-hovered"
          onTap={() => setCount(count() + 1)}
        >
          计数 {count()}
        </Button>
      </View>
      <PageNavCard
        url="/pages/l1-dynamic-template/index"
        label="Level 1"
        labelClass="is-light"
        title="动态模板"
      >
        通过数据动态渲染节点树
      </PageNavCard>
      <PageNavCard
        url="/pages/l2-vdom-to-template-data/index"
        label="Level 2"
        labelClass="is-warning"
        title="虚拟 DOM"
      >
        VDOM 树映射为动态模板数据
      </PageNavCard>
      <PageNavCard
        url="/pages/l3-0-solid-on-vdom/index"
        label="Level 3-0"
        labelClass="bg-color-solidjs"
        title="SolidJS on VDOM"
      >
        通过 VDOM 渲染器渲染 SolidJS 组件
      </PageNavCard>
      <PageNavCard
        url="/pages/l3-1-solid-on-taro-runtime/index"
        label="Level 3-1"
        labelClass="bg-color-tarojs"
        title="SolidJS on Taro"
      >
        使用 Taro Runtime DOM 和 BOM 实现
      </PageNavCard>
    </View>
  );
}

function IndexPage() {
  return (
    <View
      class="h5-body is-flex is-flex-direction-column is-flex-wrap-nowrap"
      style="height: 100%"
    >
      <View class="is-flex-grow-1 pb-4">
        <Content />
      </View>
      <View class="h5-footer footer">
        <View class="content has-text-centered">
          <View class="h5-p">
            Powered by{" "}
            <Text class="has-text-weight-bold color-solidjs">SolidJS</Text> and{" "}
            <Text class="has-text-weight-bold color-bulma">Bulma</Text>.
          </View>
        </View>
      </View>
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
  rootEl: null as MpRootElement | null,
  onLoad(_query) {
    const rootEl = (this.rootEl = mpDom.createElement("root"));
    rootEl._page = this;
    mpDom.insertBefore(rootEl);

    render(() => (<IndexPage />) as any, rootEl);
  },
  onUnload() {
    mpDom.removeChild(this.rootEl!);
    this.rootEl!._page = null;
    this.rootEl = null;
  },
  eh: eventHandler,
});
