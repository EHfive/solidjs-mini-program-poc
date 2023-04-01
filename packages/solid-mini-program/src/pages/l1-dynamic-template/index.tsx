Page({
  data: {
    root: {
      // cn: child nodes
      cn: [
        {
          // nn: node name alias, see solid-mp-vdom/src/alias.ts,
          //     "7" is <view/> for instance
          nn: "7",
          // sid: unique node ID
          sid: "_n_1",
          // cn: child nodes
          cn: [
            {
              // "6" is <text/>
              nn: "6",
              sid: "_n_2",
              cn: [
                {
                  // "8" is plain #text
                  nn: "8",
                  // v: alias for text data
                  v: "Hello",
                },
              ],
            },
            {
              nn: "7",
              sid: "_n_3",
              // st: style
              st: "display: inline; margin-left: 0.25em;",
              // cl: class
              cl: "foo-bar",
              cn: [
                {
                  nn: "8",
                  v: "World!",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  eh: function (e: WechatMiniprogram.CustomEvent) {},
  onLoad() {},
});
