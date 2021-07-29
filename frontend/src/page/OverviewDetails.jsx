import React, { useState, useEffect } from "react";
import { Tabs, Divider, Row, Col } from "antd";
import { UIStore } from "../data/state";
import { DashboardOutlined, CloseCircleTwoTone } from "@ant-design/icons";

const { TabPane } = Tabs;

const Details = ({ config, instance }) => {
  const inst = instance.find(
    (x) => x.name === config.file || x.name === config.type
  );
  return inst?.data?.map((d) => {
    const submission = config.definition.find(
      (x) => x.name === "Submission Date"
    );
    const photo = config.definition.find((x) => x.name === "Photo");
    return (
      <>
        <Divider orientation="left">{d?.[submission.alias]}</Divider>
        {photo && (
          <Row>
            <Col span={24} align="center">
              <img
                src={d?.[photo.alias]}
                alt={d?.[photo.alias]}
                style={{ height: "320px" }}
              />
            </Col>
          </Row>
        )}
        {config.definition.map((x) => (
          <Row justify="end">
            <Col span={12}>{x.name}</Col>
            <Col span={12} style={{ textAlign: "right" }}>
              {d?.[x.alias]}
            </Col>
          </Row>
        ))}
      </>
    );
  });
};

const OverviewDetails = () => {
  const [current, setCurrent] = useState(false);
  const instances = UIStore.useState((i) => i.instances);
  const tabActive = UIStore.useState((t) => t.tabActive);
  const configs = UIStore.useState((c) => c.config);
  const instance = instances[tabActive];

  if (configs?.length && tabActive !== "overview") {
    return (
      <Tabs tabPosition="left" id="overview-tabs-detail" size="small">
        {configs.map((c) => (
          <TabPane tab={c.name} key={c.name}>
            <Details config={c} instance={instance} />
          </TabPane>
        ))}
      </Tabs>
    );
  }

  return <div>Loading</div>;
};

export default OverviewDetails;
