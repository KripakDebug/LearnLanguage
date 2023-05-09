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
    const currentPath = window.location.pathname;
    const isPrivateRoute = privateRoutes.some(({ path }) =>
      currentPath.startsWith(path)
    );
    const isPublicRoute = publicRoutes.some(({ path }) =>
      currentPath.startsWith(path)
    );
    if (user && !isPrivateRoute) {
      navigate("/home");
    } else if (!user && !isPublicRoute) {
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
