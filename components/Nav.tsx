import React from "react";
import Link from "next/link";
import { useWindowSize } from "../hooks/useWindowSize";
import { GithubIcon } from "./GithubIcon";
import { AwardIcon } from "./AwardIcon";

export const Nav: React.FC = () => {
  const size = useWindowSize();

  const showIconsVersion = size.width < 500;

  return (
    <nav className="Nav">
      <div className="Nav--links">
        <Link href="/">
          <a className="Nav--link">Chemin</a>
        </Link>
        <Link href="/api-doc">
          <a className="Nav--link">API</a>
        </Link>
        <Link href="/playground">
          <a className="Nav--link">Playground</a>
        </Link>
        <a className="Nav--link" href="https://github.com/etienne-dldc/humpf">
          {showIconsVersion ? <GithubIcon size={20} /> : "Github"}
        </a>
        <a
          className="Nav--link"
          href="https://github.com/sponsors/etienne-dldc"
        >
          {showIconsVersion ? <AwardIcon size={20} /> : "Sponsor"}
        </a>
      </div>
      <div className="Nav--hr" />
    </nav>
  );
};
