import React from "react";
import { Nav } from "./Nav";

export const MainLayout: React.FC = ({ children }) => {
  return (
    <div className="Container">
      <header className="Header">
        <Nav />
      </header>
      <main className="Content">{children}</main>
    </div>
  );
};
