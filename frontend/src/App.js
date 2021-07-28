import React, { useState } from "react";
import "./App.scss";
import { Layout, Menu, Tabs } from "antd";
import Logo from "./images/logo.png";
import {
  DashboardOutlined,
  FundOutlined,
  ControlOutlined,
  SettingOutlined,
  TeamOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const dummyTab = Array.apply(null, Array(30)).map((_, i) => `Tab-${i}`);

const pageIsUnderConstruction = true;
const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const MainMenu = () => {
  return (
    <Menu theme="light" mode="inline" defaultSelectedKeys={["overview"]}>
      <Menu.Item key="overview" icon={<DashboardOutlined />}>
        Overview
      </Menu.Item>
      <Menu.Item key="inbox" icon={<InboxOutlined />}>
        Inbox
      </Menu.Item>
      <Menu.Item key="vas" icon={<FundOutlined />}>
        Value Added Services
      </Menu.Item>
      <Menu.SubMenu
        key="administration"
        icon={<ControlOutlined />}
        title="Administration"
      >
        <Menu.Item key="users" icon={<TeamOutlined />}>
          Manage Users
        </Menu.Item>
        <Menu.Item key="setting" icon={<SettingOutlined />}>
          Account Setting
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

const App = () => {
  const [collapse, setCollapse] = useState(false);
  const [tablist, setTablist] = useState(dummyTab);

  const toggleCollapse = () => {
    setCollapse(collapse ? false : true);
  };

  const handleEditTab = (x) => {
    setTablist(tablist.filter((t) => t !== x));
  };

  if (pageIsUnderConstruction) {
    return (
      <Layout id="underconstruction">
        <h1>
          <small>page is</small>Underconstruction
        </h1>
      </Layout>
    );
  }

  return (
    <Layout id="main">
      <Sider
        className="site-sidebar-menu"
        theme="light"
        collapsible
        collapsed={collapse}
        onCollapse={toggleCollapse}
        width={220}
        collapsedWidth={50}
      >
        <div className="logo">
          <img src={Logo} alt="logo"></img>
        </div>
        <MainMenu />
      </Sider>
      <Layout className="site-layout">
        <Content className="site-content">
          <Tabs
            defaultActiveKey="1"
            type="editable-card"
            size="small"
            className="site-tab"
            onEdit={handleEditTab}
          >
            {tablist.map((x) => (
              <TabPane
                tab={x === "Tab-0" ? "Overview" : x}
                key={x}
                closable={x !== "Tab-0"}
              >
                Content of card {x}
              </TabPane>
            ))}
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
