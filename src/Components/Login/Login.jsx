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

  const login = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  };

  return (
    <div className="login">
      {changeForm ? (
        <FormLogin
          auth={auth}
          openNotification={openNotification}
          setChangeForm={setChangeForm}
        />
      ) : (
        <FormRegister
          auth={auth}
          openNotification={openNotification}
          setChangeForm={setChangeForm}
          login={login}
        />
      )}
    </div>
  );

  function openNotification(error) {
    notification.open({
      message: "Помилка",
      description: error,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  }
}
