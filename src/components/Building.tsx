import { useMemo } from 'react';
import { type Building as BuildingData } from '../hooks/buildings/buildings'
import { getIndices, getNormals, getVertices } from '../hooks/buildings/mesh'

interface Props {
  building: BuildingData;
}

const buildingColor = "#d9d0c9";

export const Building = ({ building }: Props) => {
  const vertices = useMemo(
    () => getVertices(building),
    [building]
  );

  const indices = useMemo(
    () => getIndices(building),
    [building]
  );

  const normals = useMemo(
    () => getNormals(vertices, indices),
    [vertices, indices]
  );

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={vertices}
          itemSize={3}
          count={vertices.length / 3}
        />
        <bufferAttribute
          attach="attributes-normal"
          array={normals}
          itemSize={3}
          count={normals.length / 3}
        />
        <bufferAttribute
          attach="index"
          array={indices}
          itemSize={1}
          count={indices.length}
        />
      </bufferGeometry>

      <meshStandardMaterial color={ buildingColor } side={2} />
    </mesh>
  )
}
