import { Store } from "pullstate";

const defaultState = {
  menuIsCollapsed: true,
};

export const UIStore = new Store(defaultState);
