import { useMemo } from 'react';
import { type Building as BuildingData } from '../hooks/buildings/buildings'
import { getIndices, getNormals, getVertices } from '../hooks/buildings/mesh'
import { selectedBuildingSlice } from '../store/slices/building';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  building: BuildingData;
}

const inactiveColor = "#d9d0c9";
const activeColor = "#bf616a";

export const Building = ({ building }: Props) => {
  const { getSelectedBuildingId } = selectedBuildingSlice.selectors;
  const selectedBuildingId = useSelector(getSelectedBuildingId);
  const { selectBuilding } = selectedBuildingSlice.actions;
  const dispatch = useDispatch();

  const buildingColor = building.id === selectedBuildingId ?
    activeColor : inactiveColor;

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

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch(selectBuilding(building.id));
  }

  return (
    <mesh onClick={ handleClick }>
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
