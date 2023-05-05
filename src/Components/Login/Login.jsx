import React, { useContext, useState } from "react";
import "./Login.scss";
import { Context } from "../../index";
import firebase from "firebase/compat/app";
import FormLogin from "./FormLogin/FormLogin";
import FormRegister from "./FormRegister/FormRegister";
export default function Login() {
  const { auth } = useContext(Context);
  const [changeForm, setChangeForm] = useState(false);

  const login = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
  };

  return (
    <div className="login">
      {changeForm ? (
        <FormLogin
          auth={auth}
          onFinishFailed={onFinishFailed}
          setChangeForm={setChangeForm}
        />
      ) : (
        <FormRegister
          auth={auth}
          setChangeForm={setChangeForm}
          onFinishFailed={onFinishFailed}
          login={login}
        />
      )}
    </div>
  );

  function onFinishFailed(errorInfo) {
    return errorInfo;
  }
}
