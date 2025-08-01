import { useEffect, useState } from "react";
import { getBuildingsFrom, getMiddleFromNodes, getNodesFrom, type Building, type Node } from "./buildings";

export const useBuildings = () => {
  const [ buildings, setBuildings ] = useState<Building[]>([]);
  const [ middle, setMiddle ] = useState<Node | null>(null);

  useEffect(() => {
    (async () => {
      const resp = await fetch("/large.osm");
      const xml = await resp.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");

      const nodes = getNodesFrom(xmlDoc);
      const xmlBuildings = getBuildingsFrom(xmlDoc, nodes);
      const xmlMiddle = getMiddleFromNodes(nodes);

      setBuildings(xmlBuildings);
      setMiddle(xmlMiddle);
    })();
  }, []);

  return { buildings, middle };
}
