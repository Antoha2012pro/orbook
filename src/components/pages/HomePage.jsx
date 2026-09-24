import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../../shared/utils/cn";
import AuthPage from "./AuthPage";
import Section from "../ui/Section";
import Container from "../ui/Container";
import { ChartNoAxesColumn, Ellipsis, Flag, Table2 } from "lucide-react";

const CLASS_PASSWORD = "1234";

const tabs = [
  { to: "/", label: "Woche", icon: Table2, end: true },
  { to: "/testen", label: "Testen", icon: Flag },
  { to: "/statistik", label: "Statistik", icon: ChartNoAxesColumn },
  { to: "/mehr", label: "Mehr", icon: Ellipsis },
];

const HomePage = () => {
  const [isLogged, setIsLogged] = useState(
    () => localStorage.getItem("logged") === "1",
  );
  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordValue === CLASS_PASSWORD) {
      localStorage.setItem("logged", "1");
      setIsLogged(true);
    } else {
      setIsPasswordValid(false);
    }
  };

  if (!isLogged) {
    return (
      <AuthPage
        passwordValue={passwordValue}
        onChangePasswordValue={(e) => {
          setPasswordValue(e.target.value);
          setIsPasswordValid(true);
        }}
        isPasswordValid={isPasswordValid}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <Section className="min-h-dvh" containerClassName="flex min-h-dvh flex-col">
      <main className="flex-1 pb-25">
        <Outlet />
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 bg-linear-to-t from-paper to-transparent pt-10 pb-5.5">
        <Container>
          <nav className="pointer-events-auto flex h-14.5 rounded-full border border-hair bg-card p-1.75">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                aria-label={tab.label}
                className={({ isActive }) =>
                  cn(
                    "flex h-full min-w-0 basis-0 items-center justify-center rounded-full",
                    "transition-[flex-grow,background-color,color] duration-300 ease-out motion-reduce:transition-none",
                    isActive
                      ? "grow-[1.4] bg-accent text-on-accent"
                      : "grow text-faint",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <tab.icon className="size-5 shrink-0" />
                    <span
                      className={cn(
                        "overflow-hidden whitespace-nowrap text-[13px] font-extrabold leading-none [text-box:trim-both_cap_alphabetic]",
                        "transition-all duration-300 ease-out motion-reduce:transition-none",
                        isActive
                          ? "ml-1.5 max-w-24 opacity-100"
                          : "ml-0 max-w-0 opacity-0",
                      )}
                    >
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </Container>
      </div>
    </Section>
  );
};

export default HomePage;
