import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import HomePage from "../../pages/HomePage";
import Tests from "../../pages/Tests";
import Statistic from "../../pages/Statistic";
import More from "../../pages/More";
import Today from "../../pages/Today";
import Week from "../../pages/Week";

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
          { path: "heute", Component: Today },
          { path: "testen", Component: Tests },
          { path: "statistik", Component: Statistic },
          { path: "mehr", Component: More },
        ],
      },
        ]
    }
])