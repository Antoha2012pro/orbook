import { Link } from "react-router-dom";
import { Orbit } from "lucide-react";
import { cn } from "../../shared/utils/cn";

// Логотип «ORBook» (ссылка на главную).
// withIcon — фиолетовая иконка-«орбита» перед названием (как в сайдбаре на макете)
const Logo = ({ className = "items-center gap-10", titleClassName = "text-display", logoClassName, withIcon = false }) => {
  return (
    <Link to="/" className={cn("flex flex-row", className)}>
      {withIcon ? <Orbit className={cn("size-5.5 text-accent", logoClassName)} strokeWidth={2.5} /> : <div className={cn("", logoClassName)} />}
      <h2 className={cn("font-black text-ink", titleClassName)}>ORBook</h2>
    </Link>
  );
};

export default Logo;
