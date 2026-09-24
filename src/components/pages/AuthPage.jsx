import React from "react";
import Container from "../ui/Container";
import { cn } from "../../shared/utils/cn";
import { Link } from "react-router-dom";
import Section from "../ui/Section";
import { CircleAlert } from "lucide-react";

const AuthPage = ({
  passwordValue,
  onChangePasswordValue,
  isPasswordValid,
  onSubmit,
}) => {
  return (
    <Section
      className="bg-paper"
      containerClassName="flex flex-col min-h-screen py-7.5 gap-4 max-w-desktop"
    >
      <div className="space-y-4 mb-auto pt-27.5">
        <div className="" />
        <h2 className="text-[50px] font-black text-ink">ORBook</h2>
        <p className="font-normal text-[16px] text-muted">
          Stundenplan, Vertretungen und Testen in vielen Schulen
        </p>
      </div>
      <form onSubmit={onSubmit} className="mt-auto">
        <label
          htmlFor="class-password"
          className="block font-bold text-[13px] mx-1.5 mb-1.5 text-ink"
        >
          Klassenpasswort
        </label>
        <input
          id="class-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={passwordValue}
          onChange={onChangePasswordValue}
          placeholder="Passwort eingeben"
          className={cn(
            "w-full rounded-2xl bg-card h-12.5 px-4.25 text-[16px] font-normal text-ink placeholder:text-faint outline-none focus:ring-2 focus:ring-accent/30 mb-1.5",
            isPasswordValid ? "border border-transparent" : "border border-danger focus:ring-danger/30",
          )}
        />
        {isPasswordValid ? (
          <p className="text-[12px] font-normal text-muted">
            Steht in der Klassengruppe.
          </p>
        ) : (
          <div className="flex items-center gap-1.5 text-danger">
<CircleAlert className="size-3" />
<p className="text-[13px] font-normal">Falsches Passwort</p>
          </div>
        )}

        <button className="py-3.5 w-full flex gap-3 justify-center mt-4 rounded-full bg-accent text-on-accent text-[15px] font-bold" type="submit">
          <svg className="w-1 h-2" /> Öffnen
        </button>
      </form>
      <div className="flex justify-between text-[12px]">
        <Link to="/datenschutz" className={cn("font-bold text-muted")}>
          Datenschutz
        </Link>
        <p className="font-normal text-faint">
          Keine offizielle App von Indiware
        </p>
      </div>
    </Section>
  );
};

export default AuthPage;
