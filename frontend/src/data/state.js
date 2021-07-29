import { Store } from "pullstate";

const defaultState = {
  tabs: [],
  tabActive: "overview",
  instances: {},
  configs: [],
};

export const UIStore = new Store(defaultState);

fetch("/api/config")
  .then((res) => res.json())
  .then((data) =>
    UIStore.update((c) => {
      c.config = data;
    })
  );
