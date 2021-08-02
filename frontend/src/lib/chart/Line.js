import {
  Easing,
  Color,
  TextStyle,
  backgroundColor,
  Icons,
} from "./chart-style.js";
import { formatNumber } from "../util.js";
import sum from "lodash/sum";
import min from "lodash/min";
import max from "lodash/max";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";

const Line = (data, extra) => {
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
      top: "10px",
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
    },
    series: [
      {
        data: values,
        type: "line",
        markLine: {
          lineStyle: {
            type: "dashed",
          },
          data: [{ type: "average", name: "Average" }],
        },
      },
    ],
    ...Color,
    ...backgroundColor,
    ...Easing,
    ...extra,
  };
  return option;
};

export default Line;
