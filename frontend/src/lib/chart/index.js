import React from "react";
import { Col } from "antd";
import ReactECharts from "echarts-for-react";
import Bar from "./Bar";
import Maps from "./Maps";
import Pie from "./Pie";
import TreeMap from "./TreeMap";
import BarStack from "./BarStack";
import BarGroup from "./BarGroup";
import LineStack from "./LineStack";

export const generateOptions = ({ type, data }, extra) => {
  switch (type) {
    case "MAPS":
      return Maps(data, extra);
    case "PIE":
      return Pie(data, extra);
    case "DOUGHNUT":
      return Pie(data, extra, true);
    case "TREEMAP":
      return TreeMap(data, extra);
    case "BARSTACK":
      return BarStack(data, extra);
    case "BARGROUP":
      return BarGroup(data, extra);
    case "LINESTACK":
      return LineStack(data, extra);
    default:
      return Bar(data, extra);
  }
};

const Chart = ({
  type,
  title = "",
  height = "500px",
  span = 12,
  data,
  extra = {},
}) => {
  const option = generateOptions({ type: type, data: data }, extra);
  return (
    <Col span={12} style={{ height: height }}>
      <h3>{title}</h3>
      <ReactECharts option={option} />
    </Col>
  );
};

export default Chart;
