import {
  Easing,
  Color,
  TextStyle,
  backgroundColor,
  Icons,
  Legend,
} from "./chart-style.js";
import { formatNumber } from "../util.js";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";

const Bar = (data, extra) => {
  let values = [];
  let labels = [];
  data = !data ? [] : data;
  if (data.length > 0) {
    data = sortBy(data, "name");
    data = reverse(data);
    values = data.map((x) => x.value);
    labels = data.map((x) => x.name);
  }
  const text_style = TextStyle;
  let option = {
    ...Color,
    grid: {
      top: "15%",
      left: "20%",
      show: true,
      label: {
        color: "#222",
        fontFamily: "Roboto",
        ...text_style,
      },
    },
    tooltip: {
      show: true,
      trigger: "item",
      formatter: "{b}",
      padding: 5,
      backgroundColor: "#f2f2f2",
      textStyle: {
        ...text_style.textStyle,
        fontSize: 12,
      },
    },
    toolbox: {
      show: true,
      orient: "horizontal",
      left: "right",
      top: "top",
      feature: {
        saveAsImage: {
          type: "jpg",
          title: "save image",
          icon: Icons.saveAsImage,
          backgroundColor: "#ffffff",
        },
      },
      backgroundColor: "#ffffff",
    },
    yAxis: {
      type: "category",
      data: labels,
      axisLabel: {
        color: "#222",
        fontFamily: "Roboto",
        ...text_style,
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    xAxis: {
      type: "value",
    },
    series: [
      {
        data: values,
        type: "bar",
        label: {
          formatter: function (params) {
            return formatNumber(params.data);
          },
          position: "insideLeft",
          show: true,
          color: "#222",
          fontFamily: "Roboto",
          padding: 5,
          backgroundColor: "rgba(0,0,0,.3)",
          textStyle: {
            ...text_style.textStyle,
            color: "#fff",
          },
        },
      },
    ],
    legend: {
      data: labels,
      ...Legend,
    },
    ...Color,
    ...backgroundColor,
    ...Easing,
    ...extra,
  };
  return option;
};

export default Bar;
