import { Store } from "pullstate";

const defaultState = {
  tabs: [],
  tabActive: "overview",
};

export const UIStore = new Store(defaultState);
