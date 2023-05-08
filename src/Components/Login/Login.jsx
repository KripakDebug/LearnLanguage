import React, { useContext, useState } from "react";
import "./Login.scss";
import { Context } from "../../index";
import firebase from "firebase/compat/app";
import FormLogin from "./FormLogin/FormLogin";
import FormRegister from "./FormRegister/FormRegister";
import { notification } from "antd";
export default function Login() {
  const { auth } = useContext(Context);
  const [changeForm, setChangeForm] = useState(true);

  const loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  };
  const loginAnonymous = async () => {
    await auth.signInAnonymously();
  };

  return (
    <div className="login">
      <div className="form-auth">
        {changeForm ? (
          <FormLogin
            auth={auth}
            openNotification={openNotification}
            setChangeForm={setChangeForm}
          />
        ) : (
          <FormRegister
            auth={auth}
            loginAnonymous={loginAnonymous}
            openNotification={openNotification}
            setChangeForm={setChangeForm}
            login={loginWithGoogle}
          />
        )}
      </div>
    </div>
  );

  function openNotification(error) {
    notification.error({
      message: "Помилка",
      description: error,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  }
}
