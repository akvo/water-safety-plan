import React, { useState } from "react";
import { Menu, Divider, Table, Row, Col, Card, Button, Image } from "antd";
import { UIStore } from "../data/state";
import {
  PieChartTwoTone,
  ProfileTwoTone,
  ScheduleTwoTone,
  AlertTwoTone,
  BookTwoTone,
} from "@ant-design/icons";
import Chart from "../lib/chart";
import { titleCase } from "../lib/util";
import groupBy from "lodash/groupBy";
import camelCase from "lodash/camelCase";

const { SubMenu } = Menu;
const iconMenu = {
  registration: <BookTwoTone />,
  monitoring: <ScheduleTwoTone />,
  "non-compliance": <AlertTwoTone />,
};

const OverviewTable = ({ data, title, scroll = {}, clean = false }) => {
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
      render: (text) => {
        if (typeof text === "string") {
          if (text.includes("|")) {
            return (
              <ul>
                {text.split("|").map((t, i) => (
                  <li key={i}>{t}.</li>
                ))}
              </ul>
            );
          }
        }
        return text;
      },
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

const ChartCollections = ({ config, instance }) => {
  const inst = instance.find(
    (x) => x.name === config.file || x.name === config.type
  );
  const dateConfig = config.definition.find(
    (x) => x.name === "Submission Date"
  );
  const chartVars = config.definition.filter(
    (x) => x.dtype === "int64" || x.dtype === "float64" || x.options
  );
  return chartVars.map((c, ic) => {
    let data = inst.data.map((x) => ({
      name: x[dateConfig.alias],
      value: x[c.alias],
    }));
    if (c.options) {
      data = data.map((x) => ({
        "Submission Date": x.name,
        Value: x.value,
      }));
      return (
        <Col span={12}>
          <Card
            title={c.name}
            className="card-no-padding"
            style={{ minHeight: "507px" }}
          >
            <OverviewTable
              data={data}
              title={""}
              scroll={{ y: 500 }}
              clean={true}
            />
          </Card>
        </Col>
      );
    }
    return <Chart key={ic} data={data} title={c.original} type="LINE" />;
  });
};

const Details = ({ config, instance }) => {
  let inst = instance.find(
    (x) => x.name === config.file || x.name === config.type
  );
  if (config.type === "non-compliance") {
    inst = inst?.data?.map((x) => {
      let res = {};
      config.definition.forEach((d) => {
        res = { ...res, [d.name]: x[d.alias] };
      });
      return res;
    });
    return (
      <OverviewTable
        data={inst}
        title={"Non Compliance"}
        scroll={{ x: 1500 }}
      />
    );
  }
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
                <SubMenu
                  key={g}
                  title={titleCase(g)}
                  icon={iconMenu[menu[0].type]}
                >
                  {menu.map((x, i) => (
                    <Menu.Item key={x.name} style={{ paddingLeft: "25px" }}>
                      {x.name}
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            }
            return (
              <Menu.Item key={menu[0].name} icon={iconMenu[menu[0].type]}>
                {menu[0].name}
              </Menu.Item>
            );
          })}
        </Menu>
        <div id="overview-detail">
          {current.type === "monitoring" && (
            <Row>
              <Button
                style={{ marginRight: 10 }}
                onClick={() => setPage("charts")}
                type={page === "details" ? "secondary" : "primary"}
              >
                <PieChartTwoTone />
                Visual
              </Button>
              <Button
                onClick={() => setPage("details")}
                type={page === "details" ? "primary" : "secondary"}
              >
                <ProfileTwoTone />
                Data
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
