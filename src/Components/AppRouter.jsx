import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../routes";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../index";

export default function AppRouter() {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);
  return user ? (
    <Routes>
      {privateRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={<Component navigate={navigate} />}
        />
      ))}
    </Routes>
  ) : (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={<Component navigate={navigate} />}
        />
      ))}
    </Routes>
  );
}
