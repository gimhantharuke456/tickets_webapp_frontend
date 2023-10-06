import React from "react";
import { Form, Input, Button, Checkbox, Card, message } from "antd";
import state from "../store";
import { signInUser } from "../services/user_service";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      state.error = null;
      state.isLoading = true;
      const { id, nic } = await signInUser(values.username, values.password);
      console.log(id);

      state.userId = id;
      state.userNic = nic;
      navigate("/");
      state.isLoading = false;
    } catch (er) {
      message.error("Cant logged you in");
      state.error = er;
      state.isLoading = false;
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <Card>
        <h1>Login</h1>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
