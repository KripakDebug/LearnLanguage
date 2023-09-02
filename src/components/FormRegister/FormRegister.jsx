import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {openNotification} from "../../utils/notificationHelpers";

function FormRegister({ loginWithGoogle, auth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Form
      name="basic"
      style={{
        width: 300,
      }}
      layout={"vertical"}
      initialValues={{
        remember: true,
      }}
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Form.Item>
        <div className="icons-form">
          <Button type="default" onClick={loginWithGoogle}>
            <GoogleOutlined /> <span>Sign up with Google</span>
          </Button>
        </div>
      </Form.Item>
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
        <Button type="primary" htmlType="submit">
          Register
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
