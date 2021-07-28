import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import "../styles/overview.scss";
import { DashboardOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { Maps } from "../components";

const { TabPane } = Tabs;

const dummyTab = Array.apply(null, Array(30)).map((_, i) => `Tab-${i}`);

const Main = () => {
  const [data, setData] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (data.length === 0) {
      fetch("/json/mali-project.json")
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  }, [data]);
  useEffect(() => {
    if (markers.length === 0) {
      fetch("/json/example-points.json")
        .then((res) => res.json())
        .then((data) => setMarkers(data));
    }
  }, [markers]);

  return <Maps projects={data} markers={markers} />;
};

const Overview = () => {
  const [tablist, setTablist] = useState(dummyTab);
  const handleEditTab = (x) => {
    setTablist(tablist.filter((t) => t !== x));
  };

  return (
    <Tabs
      hideAdd
      defaultActiveKey="1"
      type="editable-card"
      size="small"
      id="overview"
      onEdit={handleEditTab}
    >
      {tablist.map((x, i) => (
        <TabPane
          tab={
            !i ? (
              <span>
                <DashboardOutlined />
                Overview
              </span>
            ) : (
              x
            )
          }
          key={x}
          closable={i !== 0}
          closeIcon={<CloseCircleTwoTone twoToneColor="#eb2f96" />}
        >
          {i !== 0 ? `Content of card ${x}` : <Main />}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default Overview;
