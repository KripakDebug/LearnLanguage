import React, { useContext, useState } from "react";
import "./Login.scss";
import { Context } from "../../index";
import firebase from "firebase/compat/app";
import FormLogin from "./FormLogin/FormLogin";
import FormRegister from "./FormRegister/FormRegister";
import { openNotificationError } from "./../../utils/notificationHelpers";
import { Button } from "antd";
export default function Login() {
  const { auth } = useContext(Context);
  const [changeForm, setChangeForm] = useState(true);

  const loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  };
  return (
    <div className="login">
      <div className="form-auth">
        {changeForm ? (
          <FormLogin
            auth={auth}
            openNotification={openNotificationError}
            loginWithGoogle={loginWithGoogle}
          />
        ) : (
          <FormRegister
            auth={auth}
            openNotification={openNotificationError}
            loginWithGoogle={loginWithGoogle}
          />
        )}
      </div>
      <div className="change-form-text">
        {changeForm ? "Don't have an account?" : "Already have an account?"}
      </div>
      <Button
        className="change-form-btn"
        type="link"
        onClick={() => setChangeForm((change) => !change)}
      >
        {changeForm ? "Create account" : "Log in"}
      </Button>
    </div>
  );
}
