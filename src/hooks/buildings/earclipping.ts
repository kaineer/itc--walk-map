const pointInTriangle = (p: Node, a: Node, b: Node, c: Node): boolean => {
  // Алгоритм барицентрических координат
  const d1 = (p.x - b.x) * (a.z - b.z) - (a.x - b.x) * (p.z - b.z);
  const d2 = (p.x - c.x) * (b.z - c.z) - (b.x - c.x) * (p.z - c.z);
  const d3 = (p.x - a.x) * (c.z - a.z) - (c.x - a.x) * (p.z - a.z);

  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(hasNeg && hasPos);
}

/**
 * Проверяет, является ли треугольник ABC "ухом" (выпуклым и не содержащим других вершин).
 */
const isEar = (a: Node, b: Node, c: Node, polygon: Node[]): boolean => {
  // Проверяем, что угол ABC выпуклый (векторное произведение > 0)
  const cross = (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
  if (cross <= 0) return false; // Не выпуклый или коллинеарный

  // Проверяем, что внутри треугольника ABC нет других вершин полигона
  for (const p of polygon) {
    if (p === a || p === b || p === c) continue;
    if (pointInTriangle(p, a, b, c)) return false;
  }

  return true;
}

export const earClipping = (polygon: Node[]): number[] => {
  const indices: number[] = [];
  let remainingIndices = [...polygon.map((_, i) => i)];

  while (remainingIndices.length > 3) {
    let earFound = false;

    const rl = remainingIndices.length;
    for (let i = 0; i < rl; i++) {
      const a = remainingIndices[(i - 1 + rl) % rl];
      const b = remainingIndices[i];
      const c = remainingIndices[(i + 1) % rl];

      const va = polygon[a];
      const vb = polygon[b];
      const vc = polygon[c];

      if (isEar(va, vb, vc, polygon)) {
        indices.push(a, b, c);
        remainingIndices.splice(i, 1);
        earFound = true;
        break; /* from for to while */
      }

    } /* end for */

    if (!earFound) break;
  } /* end while */

  if (remainingIndices.length === 3) {
    indices.push(
      remainingIndices[0],
      remainingIndices[1],
      remainingIndices[2]
    );
  }

  return indices;
}
