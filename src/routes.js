import {
  HOME_ROUTE,
  LIST_CARD,
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  RESET_PASSWORD_ROUTE,
  LEARN_CARD,
  PRACTICE_CARD,
} from "./utils/domenPath";
import Login from "./page/Login/Login";
import Profile from "./page/Profile/Profile";
import Home from "./page/Home/Home";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import ListCard from "./components/ListCard/ListCard";
import LearnCard from "./components/LearnCard/LearnCard";
import PracticeCard from "./components/PracticeCard/PracticeCard";

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
  {
    path: LEARN_CARD,
    Component: LearnCard,
    private: true,
  },
  {
    path: PRACTICE_CARD,
    Component: PracticeCard,
    private: true,
  },
];
