import { eventHandler } from "./shared";

Component({
  properties: {
    i: {
      type: Object,
      value: {},
    },
    l: {
      type: String,
      value: "",
    },
  },
  options: {
    addGlobalClass: true,
    virtualHost: true,
  },
  methods: {
    eh: eventHandler,
  },
});
