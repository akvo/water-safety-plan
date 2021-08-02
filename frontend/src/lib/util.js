export const formatNumber = (x) => {
  return currencyFormatter.format(x, {
    decimal: ".",
    thousand: ",",
    precision: 0,
    format: "%v",
  });
};

export const parentDeep = (id, data) => {
  let parent = data.find((x) => x.id === id);
  if (parent.parent_id !== null) {
    return parentDeep(parent.parent_id, data);
  }
  return parent;
};
