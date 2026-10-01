import { Link, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Keyboard, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { usePlanStore } from "../../shared/store/planStore";
import { cn } from "../../shared/utils/cn";
import { isTabActive } from "../../shared/utils/isTabActive";
import NavigationLink from "./NavigationLink";

// Вкладка «Einstellungen» — ведёт на «Mehr» (там настройки)
const settingsTab = { to: "/mehr", label: "Einstellungen", icon: Settings };

// ─────────────────────────────────────────────────────────────
// Низ сайдбара: «Einstellungen», статус плана, переключатель темы, «Admin».
// collapsed — сайдбар свёрнут: оставляем только иконки
// ─────────────────────────────────────────────────────────────
const SideNavFooter = ({ collapsed }) => {
  const { pathname } = useLocation(); // для подсветки «Einstellungen»
  const { theme, setTheme } = useTheme(); // светлая / тёмная тема
  const updatedAt = usePlanStore((s) => s.updatedAt); // когда обновлялся план
  const loading = usePlanStore((s) => s.loading); // идёт ли загрузка

  // Тема сейчас тёмная? («system» — смотрим на настройку системы)
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="mt-auto">
      <NavigationLink tab={settingsTab} active={isTabActive(settingsTab, pathname)} isHidden={collapsed} />

      <div className="mt-3 border-t border-hair pt-3">
        {/* статус плана: зелёная точка + время обновления */}
        <p className="flex items-center gap-2 px-2 text-caption font-semibold whitespace-nowrap text-muted" title="Stand des Vertretungsplans">
          <span className={cn("size-2 shrink-0 rounded-full", loading ? "animate-pulse bg-faint" : "bg-ok")} />
          {!collapsed && (loading ? "Plan wird geladen…" : `Plan aktuell · Stand ${format(updatedAt, "HH:mm")}`)}
        </p>

        <div className={cn("mt-2.5 flex items-center", collapsed ? "flex-col gap-2" : "justify-between")}>
          {/* переключатель темы: ☀ / ☾ */}
          <div role="group" aria-label="Darstellung" className={cn("flex rounded-full bg-sand p-0.75", collapsed && "flex-col")}>
            {[
              { value: "light", icon: Sun, label: "Hell", on: !isDark },
              { value: "dark", icon: Moon, label: "Dunkel", on: isDark },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                aria-label={option.label}
                aria-pressed={option.on}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "grid h-6.5 w-7.5 place-items-center rounded-full transition-colors",
                  option.on ? "bg-accent text-on-accent" : "text-faint hover:text-ink",
                )}
              >
                <option.icon className="size-3.5" />
              </button>
            ))}
          </div>

          {/* «Admin» */}
          <Link
            to="/admin"
            title="Admin"
            className="flex items-center gap-2 rounded-full px-2 py-1 text-caption font-semibold text-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <Keyboard className="size-4.5" />
            {!collapsed && "Admin"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideNavFooter;
