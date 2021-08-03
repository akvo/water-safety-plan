import React from "react";
import { Row, Col, Divider, Table } from "antd";

const DataRow = ({ text }) => {
  if (text.includes("|")) {
    return (
      <ul>
        {text.split("|").map((t, i) => (
          <li key={i}>{t}.</li>
        ))}
      </ul>
    );
  }
  return text;
};

const DataList = ({ data, title, scroll = {}, clean = false }) => {
  if (!data.length) {
    return "";
  }
  let columns = Object.keys(data[0])
    .filter((x) => x !== "Uuid")
    .map((x) => {
      if (x === "Submission Date") {
        return { title: x, dataIndex: x, fixed: "left" };
      }
      return { title: x, dataIndex: x };
    });
  data = data.map((x, i) => ({ key: `${i}`, ...x }));
  if (clean) {
    return (
      <Table
        scroll={scroll}
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    );
  }
  columns = columns.map((x) => {
    return {
      ...x,
      render: (text) =>
        typeof text === "string" ? <DataRow text={text} /> : text,
    };
  });
  return (
    <Row className={"table-description"}>
      <Divider orientation="left">{title}</Divider>
      <Table
        scroll={scroll}
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    </Row>
  );
};

export default DataList;
