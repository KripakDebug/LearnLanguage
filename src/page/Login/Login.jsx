import React, { useContext, useState } from "react";
import "./Login.scss";
import { informationWithFirebase } from "../../index";
import firebase from "firebase/compat/app";
import FormLogin from "../../components/FormLogin/FormLogin";
import FormRegister from "../../components/FormRegister/FormRegister";
import { openNotificationError } from "../../utils/notificationHelpers";
import { Button } from "antd";
export default function Login() {
  const { auth } = useContext(informationWithFirebase);
  const [changeForm, setChangeForm] = useState(true);

    return (
        <div className="login">
          <div className="form-auth">
            {changeForm ? (
              <FormLogin
                auth={auth}
                loginWithGoogle={loginWithGoogle}
              />
            ) : (
              <FormRegister
                auth={auth}
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

    async function loginWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    }
}
