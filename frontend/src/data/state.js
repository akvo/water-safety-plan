import { Store } from "pullstate";

const defaultState = {
  tabs: [],
};

export const UIStore = new Store(defaultState);
