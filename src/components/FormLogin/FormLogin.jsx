import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

function FormLogin({ auth, openNotification, loginWithGoogle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
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
            <Button type={"default"} onClick={loginWithGoogle}>
              <GoogleOutlined /> <span>Log in with Google</span>
            </Button>
          </div>
        </Form.Item>
        <Form.Item
          label="Email"
          name="Email"
          rules={[
            {
              required: true,
              message: "Please input your username!",
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
            Login
          </Button>
        </Form.Item>
        <NavLink className="reset-password" to={"/resetpassword"}>
          Forgot Password
        </NavLink>
      </Form>
    </>
  );
  function onSubmit() {
    signInWithEmailAndPassword(auth, email, password).catch(() => {
      openNotification("Неправильний пароль або пошта");
    });
  }
}

export default FormLogin;
