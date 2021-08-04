import React from "react";
import { Col, Card } from "antd";
import ReactECharts from "echarts-for-react";
import Bar from "./Bar";
import Pie from "./Pie";
import BarStack from "./BarStack";
import BarGroup from "./BarGroup";
import LineStack from "./LineStack";
import Line from "./Line";

export const generateOptions = ({ type, data, title }, extra) => {
  switch (type) {
    case "PIE":
      return Pie(data, extra);
    case "DOUGHNUT":
      return Pie(data, extra, true);
    case "BARSTACK":
      return BarStack(data, extra);
    case "BARGROUP":
      return BarGroup(data, extra);
    case "LINE":
      return Line(data, extra, title);
    case "LINESTACK":
      return LineStack(data, extra);
    default:
      return Bar(data, extra);
  }
};

const Chart = ({
  type,
  title = "",
  height = 450,
  span = 12,
  data,
  extra = {},
}) => {
  const option = generateOptions(
    { type: type, data: data, title: title },
    extra
  );
  return (
    <Col span={12} style={{ height: height }}>
      <Card title={title}>
        <ReactECharts
          option={option}
          style={{ height: height - 50, width: "100%" }}
        />
      </Card>
    </Col>
  );
};

export default Chart;
