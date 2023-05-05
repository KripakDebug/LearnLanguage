import { LOGIN_ROUTE, PROFILE_ROUTE } from "./utils/domenPath";
import Login from "./Components/Login/Login";
import Profile from "./Components/Profile/Profile";

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: Login,
  },
];

export const privateRoutes = [
  {
    path: PROFILE_ROUTE,
    Component: Profile,
  },
];
