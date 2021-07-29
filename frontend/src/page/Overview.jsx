import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import "../styles/overview.scss";
import { DashboardOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { Maps } from "../components";
import { UIStore } from "../data/state";

const { TabPane } = Tabs;

const Main = ({ handleEditTab }) => {
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
      fetch("/api/datapoints")
        .then((res) => res.json())
        .then((data) => setMarkers(data));
    }
  }, [markers]);

  return (
    <Maps projects={data} markers={markers} handleEditTab={handleEditTab} />
  );
};

const Overview = () => {
  const currentTabs = UIStore.useState((t) => t.tabs);
  const handleEditTab = (x) => {
    UIStore.update((u) => {
      u.tabs = currentTabs.filter((t) => t !== x);
    });
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
      <TabPane
        tab={
          <span>
            <DashboardOutlined />
            Overview
          </span>
        }
        key={"overview"}
        closable={false}
      >
        <Main handleEditTab={handleEditTab} />
      </TabPane>
      {currentTabs.map((x, i) => (
        <TabPane
          tab={x}
          key={x}
          closable={true}
          closeIcon={<CloseCircleTwoTone twoToneColor="#eb2f96" />}
        >
          Content of {x}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default Overview;
