import {
  Easing,
  Color,
  TextStyle,
  backgroundColor,
  Icons,
} from "./chart-style.js";
import { formatNumber } from "../util.js";
import sum from "lodash/sum";
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
    grid: {
      top: "10px",
      left: "5%",
      right: "5%",
      show: true,
      label: {
        color: "#222",
        fontFamily: "Roboto",
        ...text_style,
      },
    },
    xAxis: {
      type: "category",
      data: labels,
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      show: true,
      trigger: "item",
      formatter: "{c}",
      padding: 5,
      backgroundColor: "#f2f2f2",
      textStyle: {
        ...text_style.textStyle,
        fontSize: 12,
      },
    },
    series: [
      {
        data: values,
        type: "line",
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
