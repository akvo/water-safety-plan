import React, { useState } from "react";
import "./styles/app.scss";
import { Layout, Menu } from "antd";
import Logo from "./images/logo.png";
import {
  DashboardOutlined,
  PlusCircleOutlined,
  FundOutlined,
  ControlOutlined,
  SettingOutlined,
  TeamOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import * as Page from "./page";

const pageIsUnderConstruction = false;
const { Sider, Content } = Layout;

const MainMenu = () => {
  return (
    <Menu theme="light" mode="inline" defaultSelectedKeys={["overview"]}>
      <Menu.Item key="overview" icon={<DashboardOutlined />}>
        Overview Dashboard
      </Menu.Item>
      <Menu.Item key="new" icon={<PlusCircleOutlined />}>
        Add New Waterpoint
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
      <Menu.Item key="reports" icon={<SnippetsOutlined />}>
        Reports
      </Menu.Item>
      <Menu.Item
        key="vas"
        icon={<FundOutlined />}
        onClick={() => window.open("https://pemmali.org/")}
      >
        External Wash Data
      </Menu.Item>
    </Menu>
  );
};

const App = () => {
  const [collapse, setCollapse] = useState(false);

  const toggleCollapse = () => {
    setCollapse(collapse ? false : true);
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
          <Page.Overview />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
