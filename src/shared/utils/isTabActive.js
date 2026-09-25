import { matchPath } from "react-router-dom";

export const isTabActive = (tab, pathname) =>
  [tab.to, ...(tab.activeOn ?? [])].some((path) =>
    matchPath({ path, end: path === "/" }, pathname),
  );