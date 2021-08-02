import React, { useState } from "react";
import { Menu, Divider, Table, Row, Col, Button, Image } from "antd";
import { UIStore } from "../data/state";
import { PieChartTwoTone, ProfileTwoTone } from "@ant-design/icons";
import Chart from "../lib/chart";
import { titleCase } from "../lib/util";
import groupBy from "lodash/groupBy";
import camelCase from "lodash/camelCase";

const { SubMenu } = Menu;

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
      <div key={di} style={{ padding: "20px" }}>
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

const OverviewTable = ({ data, title }) => {
  const columns = Object.keys(data[0]).map((x) => ({ title: x, dataIndex: x }));
  data = data.map((x, i) => ({ key: `${i}`, ...x }));
  return (
    <Row className={"table-description"}>
      <Divider orientation="left">{title}</Divider>
      <Table columns={columns} dataSource={data} pagination={false} />
    </Row>
  );
};

const OverviewDetails = () => {
  const [page, setPage] = useState("charts");
  const [selected, setSelected] = useState("Description");
  const instances = UIStore.useState((i) => i.instances);
  const tabActive = UIStore.useState((t) => t.tabActive);
  const configs = UIStore.useState((c) => c.config);
  const statics = UIStore.useState((c) => c.static);
  const instance = instances[tabActive];
  const groups = groupBy(configs, "type");
  const current = configs.filter((x) => x.name === selected)[0];

  if (configs?.length && tabActive !== "overview") {
    return (
      <Row>
        <Menu
          mode="inline"
          id="overview-menu"
          style={{ maxWidth: "200px" }}
          onSelect={(x) => setSelected(x.key)}
        >
          {Object.keys(groups).map((g) => {
            const menu = configs.filter((x) => x.type === g);
            if (menu.length > 1) {
              return (
                <SubMenu key={g} title={titleCase(g)}>
                  {menu.map((x, i) => (
                    <Menu.Item key={x.name} style={{ paddingLeft: "25px" }}>
                      {x.name}
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            }
            return <Menu.Item key={menu[0].name}>{menu[0].name}</Menu.Item>;
          })}
        </Menu>
        <div id="overview-detail">
          {current.type === "monitoring" && (
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
          {page !== "details" && current.type === "monitoring" ? (
            <Row>
              <ChartCollections config={current} instance={instance} />
            </Row>
          ) : (
            <Details config={current} instance={instance} />
          )}
          {current.type === "registration" &&
            statics?.map((s, si) => (
              <OverviewTable key={si} data={s.data} title={s.table} />
            ))}
        </div>
      </Row>
    );
  }

  return "";
};

export default OverviewDetails;
