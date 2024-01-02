import React from "react";
import "./App.css";
import logo from "./logo0.png";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider, Layout, Menu, Image, theme } from "antd";
import { PasteSignature } from "./components/PasteSignature";
import { NetworkOverview } from "./components/NetworkOverview";
import { AddHost } from "./pages/AddHost";
import { AddSubscriber } from "./pages/AddSubscriber";
import { ContractInteraction } from "./pages/ContractInteraction";

const { Header, Content, Footer } = Layout;

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // const { darkAlgorithm } = theme;

  const navbarItems = [
    {
      key: "home",
      label: <a href="/app">Home</a>,
    },
    {
      key: "wallet",
      label: <a href="/wallet">Wallet</a>,
    },
    {
      key: "stats",
      label: <a href="/networkstats">Stats</a>,
    },
    {
      key: "contract",
      label: <a href="/contract">Contract</a>,
    },
    {
      key: "addhost",
      label: <a href="/addhost">Add Host</a>,
    },
    {
      key: "addsubscriber",
      label: <a href="/addsubscriber">Add Subscriber</a>,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        // algorithm: darkAlgorithm,
        token: { colorPrimary: "#00b96b" },
      }}
    >
      <div className="App" style={{ width: "100%", height: "100%" }}>
        <Layout>
          <Header style={{ display: "flex", alignItems: "center" }}>
            <Image src={logo} style={{ width: "100px" }} preview={false} />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              items={navbarItems}
              style={{ flex: 1, minWidth: 0 }}
            />
          </Header>
          <Content style={{ padding: "0 48px" }}>
            {/* TODO: Add breadcrumbs if navigation becomes complex. Example: */}
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb> */}
            <BrowserRouter>
              <div
                style={{
                  background: colorBgContainer,
                  minHeight: "82vh",
                  padding: 24,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Routes>
                  <Route path="/pastesig" element={<PasteSignature />} />
                  <Route path="/networkstats" element={<NetworkOverview />} />
                  <Route path="/addhost" element={<AddHost />} />
                  <Route path="/addsubscriber" element={<AddSubscriber />} />
                  <Route path="/contract" element={<ContractInteraction />} />
                </Routes>
              </div>
            </BrowserRouter>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Semaphore Network ©2023
          </Footer>
        </Layout>
      </div>
    </ConfigProvider>
  );
}

export default App;
