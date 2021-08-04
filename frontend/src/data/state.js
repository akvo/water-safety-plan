import { Store } from "pullstate";

const defaultState = {
  tabs: [],
  tabActive: "overview",
  instances: {},
  config: [],
  static: [],
  guide: [],
};

export const UIStore = new Store(defaultState);

fetch("/api/config")
  .then((res) => res.json())
  .then((cfg) => {
    fetch("/api/static")
      .then((res) => res.json())
      .then((stc) => {
        fetch("/api/guide")
          .then((res) => res.json())
          .then((gd) => {
            UIStore.update((c) => {
              c.static = stc;
              c.config = cfg;
              c.guide = gd;
            });
          });
      });
  });
