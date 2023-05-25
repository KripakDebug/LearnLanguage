import {
  HOME_ROUTE,
  LIST_CARD,
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  RESET_PASSWORD_ROUTE,
} from "./utils/domenPath";
import Login from "./Components/Login/Login";
import Profile from "./Components/Profile/Profile";
import Home from "./Components/Home/Home";
import ResetPassword from "./Components/Login/FormLogin/ResetPassword/ResetPassword";
import ListCard from "./Components/ListCard/ListCard";

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: Login,
  },
  {
    path: RESET_PASSWORD_ROUTE,
    Component: ResetPassword,
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
  {
    path: LIST_CARD,
    Component: ListCard,
    private: true,
  },
];
