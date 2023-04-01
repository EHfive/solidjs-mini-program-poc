import fs from "node:fs";
import * as helper from "@tarojs/helper";
import { Weapp } from "@tarojs/plugin-platform-weapp";

const platform = new Weapp({ helper }, {});
// platform.modifyTemplate();

const outDir = "./template/app/";

const baseTemplate = platform.template.buildTemplate({
  includes: new Set(),
  exclude: new Set(),
  thirdPartyComponents: new Map(),
  includeAll: true,
});
fs.writeFileSync(outDir + "base.wxml", baseTemplate);

if (platform.template.supportXS) {
  const utilsScript = platform.template.buildXScript();
  fs.writeFileSync(outDir + "utils.wxs", utilsScript);
}
