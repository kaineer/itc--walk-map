import { lonLatToMercator } from "./mercator";

type Tags = {[id: string]: string};

export interface Node {
  id: string;
  x: number;
  y: number;
  z: number;
  tags: Tags;
}

export interface Building {
  id: string;
  height: number;
  nodes: Node[];
  tags: Tags;
}

type NodeHash = {[id: string]: Node};

const getTags = (el: Element): Tags => {
  const tags: Tags = {};

  const tagElements = [...el.getElementsByTagName("tag")];
  tagElements.forEach((te) => {
    const key = te.getAttribute("k");
    const value = te.getAttribute("v");
    if (key && value) {
      tags[key] = value;
    }
  });

  return tags;
}

export const getNodesFrom = (xmlDoc: XMLDocument): NodeHash => {
  const nodes: NodeHash = {};
  const nodeElements = xmlDoc.getElementsByTagName("node");

  let minX = Infinity;
  let minZ = Infinity;

  [...nodeElements].forEach((el) => {
    const id: string = el.getAttribute("id")!;
    const [x, z] = lonLatToMercator(
      parseFloat(el.getAttribute("lon")!),
      -parseFloat(el.getAttribute("lat")!)
    );

    nodes[id] = {
      id,
      x: x,
      z: z,
      y: 0,
      tags: getTags(el),
    };

    minX = Math.min(minX, x);
    minZ = Math.min(minZ, z);
  });

  for (const key in nodes) {
    const node = nodes[key];
    node.x -= minX;
    node.z -= minZ;
  }

  return nodes;
}

export const getMiddleFromNodes = (nodes: NodeHash): Node => {
  const middle: Node = { id: "", x: 0, y: 0, z: 0, tags: {} };
  const values = Object.values(nodes);

  values.forEach(({ x, z }) => {
    middle.x += x;
    middle.z += z;
  });

  middle.x /= values.length;
  middle.z /= values.length;

  return middle;
}

const getBuildingHeight = (tags: Tags): number => {
  // Если указана высота, возвращаем
  if (tags.height) return parseFloat(tags.height);
  // Если указано количество этажей, умножаем на три
  if (tags["building:levels"]) return parseInt(tags["building:levels"]) * 3;
  // Если ничего нет, возвращаем три метра
  return 3;
}

const getBuildingNodes = (el: Element, nodes: NodeHash): Node[] => {
  const refElements = el.getElementsByTagName("nd");
  const angles: Node[] = [];
  [...refElements].forEach((nd) => {
    const ref = nd.getAttribute("ref");
    if (ref) {
      const node = nodes[ref];
      if (node && (!angles.length || node.id !== angles[0].id)) {
        angles.push(node);
      }
    }
  });
  return angles;
}

export const getBuildingsFrom = (xmlDoc: XMLDocument, nodes: NodeHash): Building[] => {
  const wayElements = xmlDoc.getElementsByTagName("way");
  const buildings: Building[] = [];

  [...wayElements].forEach((el) => {
    const tags = getTags(el);
    if (tags.building) {
      buildings.push({
        id: el.getAttribute('id') || '',
        height: getBuildingHeight(tags),
        nodes: getBuildingNodes(el, nodes),
        tags,
      });
    }
  });

  return buildings;
}
