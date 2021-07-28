import React from "react";
import "./App.scss";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

const pageIsUnderConstruction = true;
const { Sider, Header, Content } = Layout;

const App = () => {
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
      <Sider theme="light" trigger={null} collapsible collapsed={false}>
        <div className="logo" />
        <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            nav 2
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            nav 3
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {true ? (
            <MenuFoldOutlined className="trigger" />
          ) : (
            <MenuUnfoldOutlined className="trigger" />
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
