import React from "react";
import { cn } from "../../shared/utils/cn";
import { Link } from "react-router-dom";

const Logo = ({ className = "items-center gap-10", titleClassName = "text-[50px]", logoClassName }) => {
  return (
    <Link to="/" className={cn("flex flex-row", className)}>
      <div className={cn('', logoClassName)} />
      <h2 className={cn("font-black text-ink", titleClassName)}>ORBook</h2>
    </Link>
  );
};

export default Logo;
