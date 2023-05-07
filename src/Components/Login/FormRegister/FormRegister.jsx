import React, { useState } from "react";
import { Button, Checkbox, Form, Input, notification } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";

function FormRegister({ login, setChangeForm, auth, openNotification }) {
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
      switch (error.message) {
        case "Firebase: The email address is already in use by another account. (auth/email-already-in-use).":
          openNotification("Ця електрона адреса вже є в базі");
          break;
        case "Firebase: The email address is badly formatted. (auth/invalid-email).":
          openNotification("Некоректна електрона адреса");
          break;
        default:
          openNotification("Мінімум символів в паролі 6");
      }
    });
  }
}
export default FormRegister;
