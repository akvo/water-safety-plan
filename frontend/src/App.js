import React, { useState } from "react";
import "./App.scss";
import { Layout, Menu } from "antd";
import Logo from "./images/logo.png";
import {
  DashboardOutlined,
  FundOutlined,
  ControlOutlined,
  SettingOutlined,
  TeamOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const pageIsUnderConstruction = true;
const { Sider, Content } = Layout;

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
        <Content className="site-content"></Content>
      </Layout>
    </Layout>
  );
};

export default App;
