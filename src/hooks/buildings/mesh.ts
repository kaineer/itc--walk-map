import type { Building } from "./buildings";
import { earClipping } from "./earclipping";

// Get vertices attribute
//
export const getVertices = (building: Building): Float32Array => {
  const vertices: number[] = [];

  building.nodes.forEach(({ x, z }) => {
    vertices.push(x, 0, z);
  });

  building.nodes.forEach(({ x, z }) => {
    vertices.push(x, building.height, z);
  });

  return new Float32Array(vertices);
}

// В итоге решили, что без верхней и нижней крышек
//   можно обойтись
export const getIndices = (building: Building): Uint16Array => {
  const vertexCount = building.nodes.length;
  const indices: number[] = [];

  const backOffset = vertexCount;

  // Боковые грани (квады → треугольники)
  for (let i = 0; i < vertexCount; i++) {
    const next = (i + 1) % vertexCount;
    indices.push(
      i, next, backOffset + i,
      next, backOffset + next, backOffset + i
    );
  }

  return new Uint16Array(indices);
}

// Get normals
//
export const getNormals = (vertices: Float32Array, indices: Uint16Array): Float32Array => {
  const normals = new Float32Array(vertices.length);
  const v = (i: number) => [vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]];

  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i];
    const b = indices[i + 1];
    const c = indices[i + 2];

    const [ax, ay, az] = v(a);
    const [bx, by, bz] = v(b);
    const [cx, cy, cz] = v(c);

    // Векторы AB и AC
    const ab = [bx - ax, by - ay, bz - az];
    const ac = [cx - ax, cy - ay, cz - az];

    // Нормаль через векторное произведение AB × AC
    const nx = ab[1] * ac[2] - ab[2] * ac[1];
    const ny = ab[2] * ac[0] - ab[0] * ac[2];
    const nz = ab[0] * ac[1] - ab[1] * ac[0];

    // Нормализуем и записываем для всех трех вершин треугольника
    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
    const normalized = length > 0 ? [nx / length, ny / length, nz / length] : [0, 0, 1];

    for (let j = 0; j < 3; j++) {
      normals[a * 3 + j] += normalized[j];
      normals[b * 3 + j] += normalized[j];
      normals[c * 3 + j] += normalized[j];
    }
  }

  // Нормализуем итоговые нормали (усредняем)
  for (let i = 0; i < normals.length; i += 3) {
    const [nx, ny, nz] = [normals[i], normals[i + 1], normals[i + 2]];
    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (length > 0) {
      normals[i] /= length;
      normals[i + 1] /= length;
      normals[i + 2] /= length;
    }
  }

  return normals;
}
