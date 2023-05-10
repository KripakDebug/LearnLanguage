import React, { useContext, useState } from "react";
import { Button, Form, Input } from "antd";
import { Context } from "../../../../index";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  openNotification,
  openNotificationError,
} from "../../../../utils/notificationHelpers";
import { NavLink } from "react-router-dom";

export default function ResetPassword() {
  const { auth } = useContext(Context);
  const [email, setEmail] = useState("");
  return (
    <div className="login">
      <div className="form-auth">
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

          <Form.Item>
            <Button
              type="primary"
              onClick={sendMessageToEmail}
              htmlType="submit"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
      <NavLink className="change-form-btn" to="/login">
        Log in
      </NavLink>
    </div>
  );
  function onSubmit() {
    console.log("ok");
  }

  function sendMessageToEmail() {
    sendPasswordResetEmail(auth, email)
      .then((res) => {
        openNotification("We sent password instructions to your email\n");
      })
      .catch((err) => {
        openNotificationError("Wrong email");
      });
  }
}
