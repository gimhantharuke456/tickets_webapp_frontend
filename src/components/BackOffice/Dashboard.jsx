import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  UserOutlined,
  FileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import state from "../../store";
import Travellers from "../Travellers/Travellers"; // Import the Travellers component
import Trains from "../Trains/Trains";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import Reservations from "../reservations/Reservations";
const { Sider, Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(1);
  const handleLogout = () => {
    // Clear user data from local storage and state
    localStorage.removeItem("userId");
    localStorage.removeItem("userNic");
    state.userId = null;
    state.userNic = null;

    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} theme="dark">
        <Menu mode="vertical" theme="dark" defaultSelectedKeys={["1"]}>
          <Menu.Item
            onClick={() => {
              setActiveIndex(2);
            }}
            key="2"
            icon={<UserOutlined />}
          >
            Travellers
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setActiveIndex(3);
            }}
            key="3"
            icon={<FontAwesomeIcon icon={icon({ name: "train" })} />}
          >
            Trains
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setActiveIndex(4);
            }}
            key="4"
            icon={<FontAwesomeIcon icon={icon({ name: "book" })} />}
          >
            Reservations
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<LogoutOutlined />}
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: "16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <h1>Welcome Back, {state.userNic}!</h1>

            {activeIndex == 1 && <div></div>}
            {activeIndex == 2 && <Travellers />}
            {activeIndex == 3 && <Trains />}
            {activeIndex == 4 && <Reservations />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
