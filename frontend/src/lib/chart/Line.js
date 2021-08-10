import { Easing, Color, TextStyle, backgroundColor } from "./chart-style.js";
import sortBy from "lodash/sortBy";
import maxBy from "lodash/maxBy";
import { UIStore } from "../../data/state";

const Line = (data, extra, title) => {
  let guide = UIStore.useState((i) => i.guide);
  let max = maxBy(data, "value");
  max = max.value;
  guide = guide.find((x) => title.includes(x.question));
  if (guide) {
    max = max < guide.value ? guide.value : max;
    guide = [
      {
        type: "line",
        markLine: {
          lineStyle: {
            type: "dashed",
            color: "red",
          },
          symbol: "circle",
          label: {
            show: true,
            position: "middle",
            formatter: "{b}",
          },
          data: [{ name: "WHO Guideline", yAxis: guide.value }],
        },
      },
    ];
  } else {
    guide = [];
  }
  let values = [];
  let labels = [];
  data = !data ? [] : data;
  if (data.length > 0) {
    data = sortBy(data, "name");
    values = data.map((x) => x.value);
    labels = data.map((x) => x.name);
  }
  const text_style = TextStyle;
  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        animation: false,
        label: {
          backgroundColor: "#ccc",
          borderColor: "#aaa",
          borderWidth: 1,
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,

          color: "#222",
        },
        textStyle: {
          ...text_style.textStyle,
          fontSize: 12,
        },
        padding: 5,
        backgroundColor: "#f2f2f2",
      },
    },
    grid: {
      top: "20px",
      left: "10%",
      right: "10%",
      containLabel: true,
      label: {
        color: "#222",
        fontFamily: "Roboto",
        ...text_style,
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: labels,
    },
    yAxis: {
      type: "value",
      max: max,
      axisLabel: {
        show: true,
      },
    },
    series: [
      {
        data: values,
        type: "line",
      },
      ...guide,
    ],
    ...Color,
    ...backgroundColor,
    ...Easing,
    ...extra,
  };
  return option;
};

export default Line;
