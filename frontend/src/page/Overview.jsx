import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import "../styles/overview.scss";
import { DashboardOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { Maps } from "../components";
import OverviewDetails from "./OverviewDetails";
import { UIStore } from "../data/state";

const { TabPane } = Tabs;

const Main = ({ handleEditTab, handleActiveTab }) => {
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
    <Maps
      projects={data}
      markers={markers}
      handleEditTab={handleEditTab}
      handleActiveTab={handleActiveTab}
    />
  );
};

const Overview = () => {
  const tabList = UIStore.useState((t) => t.tabs);
  const tabActive = UIStore.useState((t) => t.tabActive);
  const handleEditTab = (x) => {
    UIStore.update((u) => {
      u.tabs = tabList.filter((t) => t !== x);
      u.tabActive =
        tabActive !== x
          ? tabActive === "overview"
            ? "overview"
            : tabActive
          : "overview";
    });
  };

  const handleActiveTab = (x) => {
    UIStore.update((u) => {
      u.tabActive = x;
    });
  };

  return (
    <Tabs
      hideAdd
      activeKey={tabActive}
      type="editable-card"
      size="small"
      id="overview"
      onEdit={handleEditTab}
      onTabClick={handleActiveTab}
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
        <Main handleEditTab={handleEditTab} handleActiveTab={handleActiveTab} />
      </TabPane>
      {tabList.map((x, i) => (
        <TabPane
          tab={x}
          key={x}
          closable={true}
          closeIcon={<CloseCircleTwoTone twoToneColor="#eb2f96" />}
        >
          <OverviewDetails />
        </TabPane>
      ))}
    </Tabs>
  );
};

export default Overview;
