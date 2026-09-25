import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../shared/utils/cn";
import AuthPage from "./AuthPage";
import Section from "../components/ui/Section";
import Container from "../components/ui/Container";
import { ChartNoAxesColumn, Ellipsis, Flag, Table2 } from "lucide-react";
import SideNav from "../components/navbar/SideNav";
import BottomNav from "../components/navbar/BottomNav";

const CLASS_PASSWORD = "1234";

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
    <Container className="min-h-dvh desktop:flex desktop:gap-8">
      <SideNav />

      <main className="min-w-0 flex-1 pt-6 pb-28 desktop:pb-8">
        <Outlet />
      </main>

      <BottomNav />
    </Container>
  );
};

export default HomePage;
