import React, { useState, useEffect } from "react";
import { Tabs, Divider, Row, Col, Button, Image } from "antd";
import { UIStore } from "../data/state";
import {
  DashboardOutlined,
  CloseCircleTwoTone,
  PieChartTwoTone,
  ProfileTwoTone,
} from "@ant-design/icons";

const { TabPane } = Tabs;

const Details = ({ config, instance }) => {
  const inst = instance.find(
    (x) => x.name === config.file || x.name === config.type
  );
  return inst?.data?.map((d, di) => {
    const submission = config.definition.find(
      (x) => x.name === "Submission Date"
    );
    const photo = config.definition.find((x) => x.name === "Photo");
    return (
      <div key={di}>
        <Divider orientation="left">{d?.[submission.alias]}</Divider>
        {photo && (
          <Row style={{ height: 310, overflow: "hidden", marginBottom: 20 }}>
            <Col
              span={24}
              className="image-overlay"
              style={{
                backgroundImage: `url("${d?.[photo.alias]}")`,
                height: 320,
              }}
            ></Col>
            <Col span={24} align="center" style={{ marginTop: -320 }}>
              <Image
                src={d?.[photo.alias]}
                alt={d?.[photo.alias]}
                height={320}
              />
            </Col>
          </Row>
        )}
        {config.definition
          .filter((x) => x.name !== "Photo" || x.name !== "Submission Date")
          .map((x, xi) => (
            <Row justify="end" key={xi}>
              <Col span={12}>{x.name}</Col>
              <Col span={12} style={{ textAlign: "right" }}>
                {d?.[x.alias]}
              </Col>
            </Row>
          ))}
      </div>
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
            <Button style={{ marginRight: 10 }}>
              <PieChartTwoTone />
              Charts
            </Button>
            <Button>
              <ProfileTwoTone />
              Data
            </Button>
            <Details config={c} instance={instance} />
          </TabPane>
        ))}
      </Tabs>
    );
  }

  return <div>Loading</div>;
};

export default OverviewDetails;
