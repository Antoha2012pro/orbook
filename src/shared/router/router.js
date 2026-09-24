import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import HomePage from "../../components/pages/HomePage";
import ThisWeek from "../../components/pages/ThisWeek";
import Tests from "../../components/pages/Tests";
import Statistic from "../../components/pages/Statistic";
import More from "../../components/pages/More";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
        Component: HomePage,
        children: [
          { index: true, Component: ThisWeek },
          { path: "testen", Component: Tests },
          { path: "statistik", Component: Statistic },
          { path: "mehr", Component: More },
        ],
      },
        ]
    }
])