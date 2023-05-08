import { HOME_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from "./utils/domenPath";
import Login from "./Components/Login/Login";
import Profile from "./Components/Profile/Profile";
import Home from "./Components/Home/Home";

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: Login,
  },
];

export const privateRoutes = [
  {
    path: HOME_ROUTE,
    Component: Home,
    private: true,
  },
  {
    path: PROFILE_ROUTE,
    Component: Profile,
    private: true,
  },
];
