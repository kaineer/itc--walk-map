import { useGLTF } from "@react-three/drei";

interface Point {
  x: number;
  z: number;
}

interface Props {
  point: Point;
  modelPath: string;
  scale?: number;
}

export const BlenderBuilding = ({ modelPath, point, scale = 1 }: Props) => {
  const { scene } = useGLTF(modelPath);

  return (
    <group position={[point.x, 0, point.z]} rotation={[0, 0, 0]} scale={[ scale, scale, scale ]}>
      <primitive object={scene} />
    </group>
  );
}
