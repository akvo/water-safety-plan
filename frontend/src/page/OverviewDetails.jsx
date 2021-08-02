import React, { useState } from "react";
import { Tabs, Divider, Row, Col, Button, Image } from "antd";
import { UIStore } from "../data/state";
import { PieChartTwoTone, ProfileTwoTone } from "@ant-design/icons";
import Chart from "../lib/chart";

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

const ChartCollections = ({ config, instance }) => {
  const inst = instance.find(
    (x) => x.name === config.file || x.name === config.type
  );
  const dateConfig = config.definition.find(
    (x) => x.name === "Submission Date"
  );
  const chartVars = config.definition.filter(
    (x) => x.dtype === "int64" || x.dtype === "float64"
  );
  return chartVars.map((c, ic) => {
    const data = inst.data.map((x) => ({
      name: x[dateConfig.alias],
      value: x[c.alias],
    }));
    return <Chart key={ic} data={data} title={c.original} type="LINE" />;
  });
};

const OverviewDetails = () => {
  const [page, setPage] = useState("details");
  const instances = UIStore.useState((i) => i.instances);
  const tabActive = UIStore.useState((t) => t.tabActive);
  const configs = UIStore.useState((c) => c.config);
  const instance = instances[tabActive];

  if (configs?.length && tabActive !== "overview") {
    return (
      <Tabs tabPosition="left" id="overview-tabs-detail" size="small">
        {configs.map((c) => (
          <TabPane tab={c.name} key={c.name}>
            {c.type === "monitoring" && (
              <Row>
                <Button
                  style={{ marginRight: 10 }}
                  onClick={() => setPage("details")}
                  type={page === "details" ? "primary" : "secondary"}
                >
                  <ProfileTwoTone />
                  Data
                </Button>
                <Button
                  onClick={() => setPage("charts")}
                  type={page === "details" ? "secondary" : "primary"}
                >
                  <PieChartTwoTone />
                  Charts
                </Button>
                <Divider />
              </Row>
            )}
            {page !== "details" && c.type === "monitoring" ? (
              <Row>
                <ChartCollections config={c} instance={instance} />
              </Row>
            ) : (
              <Details config={c} instance={instance} />
            )}
          </TabPane>
        ))}
      </Tabs>
    );
  }

  return <div>Loading</div>;
};

export default OverviewDetails;
