import React, { useState } from "react";
import { Menu, Divider, Row, Col, Card, Button } from "antd";
import { UIStore } from "../data/state";
import {
  PieChartTwoTone,
  ProfileTwoTone,
  ScheduleTwoTone,
  AlertTwoTone,
  BookTwoTone,
  MessageTwoTone,
  ExperimentTwoTone,
  ControlTwoTone,
  ToolTwoTone,
} from "@ant-design/icons";
import Chart from "../lib/chart";
import { titleCase } from "../lib/util";
import groupBy from "lodash/groupBy";
import { Monitoring, DataList, CommentList } from "../components";

const { SubMenu } = Menu;
const iconMenu = {
  registration: <BookTwoTone />,
  monitoring: <ScheduleTwoTone />,
  "non-compliance": <AlertTwoTone />,
  improvement: <ToolTwoTone />,
  operation: <ControlTwoTone />,
  research: <ExperimentTwoTone />,
  feedback: <MessageTwoTone />,
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
        <Col span={12} key={ic}>
          <Card
            title={c.name}
            className="card-no-padding"
            style={{ minHeight: "507px" }}
          >
            <DataList
              data={data}
              title={c.name}
              scroll={{ y: 500 }}
              clean={true}
              config={config}
            />
          </Card>
        </Col>
      );
    }
    return <Chart key={ic} data={data} title={c.original} type="LINE" />;
  });
};

const Details = ({ config, instance }) => {
  instance = instance.find(
    (x) => x.name === config.file || x.name === config.type
  );
  const data = instance?.data?.map((x) => {
    let res = {};
    config.definition.forEach((d) => {
      res = { ...res, [d.name]: x[d.alias] };
    });
    return res;
  });
  switch (config.type) {
    case "non-compliance":
      return (
        <DataList data={data} title={"Non Compliance"} scroll={{ x: 1500 }} />
      );
    case "operation":
      return "";
    case "research":
      return "";
    case "improvement":
      return "";
    case "feedback":
      return <CommentList data={data} />;
    default:
      return <Monitoring instance={instance} config={config} />;
  }
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
                    <Menu.Item
                      key={x.name}
                      style={{
                        paddingLeft: "25px",
                        borderBottom: "solid 1px #ddd",
                        marginBottom: 0,
                        marginTop: 0,
                      }}
                    >
                      {i + 1}. {x.name}
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
                type={page === "charts" ? "primary" : "secondary"}
              >
                <PieChartTwoTone />
                Visual
              </Button>
              <Button
                style={{ marginRight: 10 }}
                onClick={() => setPage("details")}
                type={page === "details" ? "primary" : "secondary"}
              >
                <ProfileTwoTone />
                Data
              </Button>
              <Button
                onClick={() => setPage("form")}
                type={page === "form" ? "primary" : "secondary"}
              >
                <ProfileTwoTone />
                Monitoring Form
              </Button>
              <Divider />
            </Row>
          )}
          {page !== "details" && current.type === "monitoring" ? (
            <Row>
              {page === "form" ? (
                ""
              ) : (
                <ChartCollections config={current} instance={instance} />
              )}
            </Row>
          ) : (
            <Details config={current} instance={instance} />
          )}
          {current.type === "registration" &&
            statics?.map((s, si) => (
              <DataList key={si} data={s.data} title={s.table} />
            ))}
        </div>
      </Row>
    );
  }

  return "";
};

export default OverviewDetails;
