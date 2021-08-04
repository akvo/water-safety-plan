import { Easing, Color, TextStyle, backgroundColor } from "./chart-style.js";
import _ from "lodash";

const LineStack = (data, extra) => {
  const { xAxisName, yAxisName } = extra;
  if (!data) {
    return {
      title: {
        text: "No Data",
        subtext: "",
        left: "center",
        top: "20px",
        ...TextStyle,
      },
    };
  }
  let xAxis = _.uniq(data.map((x) => x.group));
  let legends = _.uniq(data.map((x) => x.name));
  let series = _.chain(data)
    .groupBy("name")
    .map((x, i) => {
      return {
        name: i,
        label: {
          show: true,
          position: "inside",
          color: "#a43332",
        },
        stack: i,
        type: "line",
        data: x.map((v) => v.value),
      };
    })
    .value();
  series = _.sortBy(series, "name");
  let option = {
    ...Color,
    legend: {
      data: _.sortBy(legends),
      icon: "circle",
      top: "0px",
      left: "center",
      align: "auto",
      orient: "horizontal",
      textStyle: {
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 12,
      },
    },
    label: {
      show: true,
      align: "left",
      formatter: function (params) {
        if (params.dataIndex === xAxis.length - 1) {
          return params.seriesName + ": " + params.value;
        }
        return "";
      },
      offset: [10, 0],
    },
    grid: {
      top: "50px",
      left: yAxisName ? "50px" : "auto",
      right: "100px",
      bottom: xAxisName ? "50px" : "25px",
      borderColor: "#ddd",
      borderWidth: 0.5,
      show: true,
      label: {
        color: "#222",
        fontFamily: "Roboto",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}",
      backgroundColor: "#ffffff",
      ...TextStyle,
    },
    toolbox: { show: false },
    yAxis: {
      name: yAxisName ? yAxisName : "",
      nameLocation: "center",
      nameGap: 25,
      nameTextStyle: {
        fontFamily: "Roboto",
        fontSize: 14,
        color: "#222",
      },
      type: "value",
      axisLabel: {
        inside: true,
        backgroundColor: "#f2f2f2",
        padding: 5,
        fontFamily: "Roboto",
        fontSize: 12,
      },
      logBase: 10,
      axisLine: { show: false },
    },
    xAxis: {
      name: xAxisName ? xAxisName : "",
      nameLocation: "center",
      nameGap: 35,
      nameTextStyle: {
        fontFamily: "Roboto",
        fontSize: 14,
        color: "#222",
      },
      data: xAxis,
      type: "category",
      axisLine: {
        lineStyle: {
          color: "#ddd",
        },
      },
      axisLabel: {
        fontFamily: "Roboto",
        fontSize: 12,
        color: "#222",
      },
    },
    series: series,
    ...Color,
    ...backgroundColor,
    ...Easing,
    ...extra,
  };
  return option;
};

export default LineStack;
