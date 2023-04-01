import * as helper from "@tarojs/helper";
import { Weapp } from "@tarojs/plugin-platform-weapp";

const platform = new Weapp({ helper }, {});
// platform.modifyTemplate();

platform.template.buildTemplate({
  includes: new Set(),
  exclude: new Set(),
  thirdPartyComponents: new Map(),
  includeAll: true,
});

const alias = platform.template.componentsAlias;

console.log(JSON.stringify(alias, null, 2));
