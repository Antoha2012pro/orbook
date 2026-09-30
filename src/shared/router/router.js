import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import HomePage from "../../pages/HomePage";
import Tests from "../../pages/Tests";
import Statistic from "../../pages/Statistic";
import More from "../../pages/More";
import Week from "../../pages/Week";
import Day from "../../pages/Day";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
        Component: HomePage,
        children: [
          { index: true, Component: Week },
          { path: "woche", Component: Week },
          { path: "heute", Component: Day }, // сегодняшний день
          { path: "tag/:datum", Component: Day }, // любой день: /tag/2025-09-17
          { path: "testen", Component: Tests },
          { path: "statistik", Component: Statistic },
          { path: "mehr", Component: More },
        ],
      },
        ]
    }
])
