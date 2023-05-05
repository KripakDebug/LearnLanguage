import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";

function FormRegister({ onFinishFailed, login, setChangeForm, auth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onSubmit}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="Email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <GoogleOutlined onClick={login} />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Register
        </Button>
        <Button type="default" onClick={() => setChangeForm(true)}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
  function onSubmit() {
    createUserWithEmailAndPassword(auth, email, password).catch((error) => {
      console.log(error);
    });
  }
}

export default FormRegister;
