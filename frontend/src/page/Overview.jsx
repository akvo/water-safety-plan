import React, { useState, useEffect } from "react";
import { Tabs, Tag } from "antd";
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
    <div style={{ position: "relative" }}>
      <Maps
        projects={data}
        markers={markers}
        handleEditTab={handleEditTab}
        handleActiveTab={handleActiveTab}
      />
      <Tag color="red" style={{ position: "absolute", bottom: 20, right: 120 }}>
        1 Compliance
      </Tag>
      <Tag color="blue" style={{ position: "absolute", bottom: 20, right: 10 }}>
        {markers?.length} Waterpoints
      </Tag>
    </div>
  );
};

const Overview = () => {
  const tabList = UIStore.useState((t) => t.tabs);
  const instances = UIStore.useState((i) => i.instances);
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
    if (!instances?.[x] && x !== "overview") {
      fetch(`/api/datapoints/${x}`)
        .then((res) => res.json())
        .then((data) => {
          UIStore.update((i) => {
            i.instances = { ...instances, ...{ [x]: data } };
            i.tabActive = x;
          });
        });
    } else {
      UIStore.update((u) => {
        u.tabActive = x;
      });
    }
  };

  return (
    <Tabs
      hideAdd
      activeKey={tabActive}
      type="editable-card"
      size="small"
      id="overview-tabs"
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
