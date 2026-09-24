import React, { useState } from "react";
import Container from "../ui/Container";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  if (!isLogged) {
    return (<div className="bg-paper">
      <Container className="flex flex-col min-h-screen">
        <div className="space-y-6 mb-auto pt-35">
          <div className="" />
          <h2 className="text-[50px] font-bold">ORBook</h2>
          <p className="font-normal text-[16px]">
            Stundenplan, Vertretungen und Testen in vielen Schulen
          </p>
        </div>
        <form className="mb-4 mt-auto">
          <p className="font-bold text-[13px] mx-1.6">Klassenpasswort</p>
          <input
            type="text"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            placeholder="Passwort eingeben"
            className="py-3.5 pl-4.25 pr-2 text-[16px] font-normal bg-card text-ink placeholder:text-faint w-full"
          />
          {isPasswordValid ? (<p className="text-[12px] font-normal text-muted">Steht in der Klassengruppe.</p>) : (<div>
            <img src="" alt="" />
            <p></p>
          </div>)}
          
          <button className="py-3.5 w-full space-x-3 rounded-2 mt-4 rounded-full bg-accent text-on-accent"><div /> Öffnen</button>
        </form>
        <div className="flex justify-between text-[12px]">
            <Link to="/datenschutz" className={({isActive}) => cn(
                isActive ? "" : "",
                "font-bold",
            )}>Datenschutz</Link>
            <p className="font-normal">Keine offizielle App von Indiware</p>
        </div>
      </Container>
    </div>)
  }
    

  return <div>
    <h2>asdasd</h2>
  </div>;
};

export default HomePage;
