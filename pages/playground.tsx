import React, { useState, useMemo, useCallback } from "react";
import { MainLayout } from "../components/MainLayout";
import { Chemin, CheminParam, CheminMatchMaybe } from "chemin";
import { expectNever } from "../utils";
import cuid from "cuid";

type CheminItemPart =
  | { type: "constant"; name: string }
  | { type: "ref"; cheminId: string };

interface CheminItem {
  id: string;
  name: string;
  parts: Array<CheminItemPart>;
}

interface PathItem {
  id: string;
  path: string;
  exact: boolean;
}

interface PathItemWithMatch extends PathItem {
  match: CheminMatchMaybe<any> | null;
}

function resolveChemin(chemins: Array<CheminItem>, id: string): Chemin | null {
  const cache = new Map<string, Chemin>();

  function resolvePart(
    part: CheminItemPart
  ): CheminParam<string, any> | Chemin {
    if (part.type === "constant") {
      return CheminParam.constant(part.name);
    }
    if (part.type === "ref") {
      const resolved = resolve(part.cheminId);
      if (resolved === null) {
        throw new Error(`Cannot find ref`);
      }
      return resolved;
    }
    return expectNever(part);
  }

  function resolve(id: string) {
    const cached = cache.get(id);
    if (cached) {
      return cached;
    }
    const item = chemins.find((c) => c.id === id);
    if (!item) {
      return null;
    }
    const partsResolved = item.parts.map(resolvePart);
    const chemin = Chemin.create(...partsResolved);
    cache.set(id, chemin);
    return chemin;
  }

  return resolve(id);
}

export default function Home(): JSX.Element {
  const [chemins, setChemins] = useState<Array<CheminItem>>([]);
  const [paths, setPaths] = useState<Array<PathItem>>([]);
  const [selectedCheminId, setSelectedCheminId] = useState<string | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  const addChemin = useCallback(() => {
    setChemins((prev) => {
      return [
        ...prev,
        {
          id: cuid.slug(),
          name: `chemin_${prev.length + 1}`,
          parts: [],
        },
      ];
    });
  }, []);

  const addPath = useCallback(() => {
    setPaths((prev) => {
      return [
        ...prev,
        {
          id: cuid.slug(),
          path: "",
          exact: false,
        },
      ];
    });
  }, []);

  const currentChemin = useMemo(() => {
    if (selectedCheminId === null) {
      return null;
    }
    return resolveChemin(chemins, selectedCheminId);
  }, [chemins, selectedCheminId]);

  const pathWithMatches = useMemo((): Array<PathItemWithMatch> => {
    if (currentChemin === null) {
      return paths.map((path) => ({
        ...path,
        match: null,
      }));
    }
    return paths.map((path) => {
      return {
        ...path,
        match: currentChemin.match(path.path),
      };
    });
  }, [currentChemin, paths]);

  const currentPath = useMemo((): PathItemWithMatch | null => {
    if (selectedPathId === null) {
      return null;
    }
    const path = pathWithMatches.find((p) => p.id === selectedPathId);
    if (!path) {
      return null;
    }
    return path;
  }, [pathWithMatches, selectedPathId]);

  return (
    <MainLayout>
      <div className="Playground">
        <div>
          {chemins.map((chemin) => (
            <div key={chemin.id}>
              <h2>{chemin.name}</h2>
              <div>
                {chemin.parts.map((part, index) => {
                  return <div key={index}>{JSON.stringify(part)}</div>;
                })}
                <button>+</button>
              </div>
            </div>
          ))}
          <button onClick={addChemin}>Add Chemin</button>
        </div>
        <div>
          {paths.map((path) => (
            <div key={path.id}>
              <input value={path.path} readOnly />
            </div>
          ))}
          <button onClick={addPath}>Add Path</button>
        </div>
        <div>{currentPath && <div>{JSON.stringify(currentPath)}</div>}</div>
      </div>
    </MainLayout>
  );
}
