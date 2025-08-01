import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';
import { cameraPresetsSlice } from "../../store/slices/cameras";
import { useSelector } from "react-redux";

interface Props {
  ref: RefObject<any>;
  height?: number;
}

export const FollowCurrentPreset = ({ ref, height = 1.8 }: Props) => {
  const { getCurrentPreset } = cameraPresetsSlice.selectors;
  const currentPreset = useSelector(getCurrentPreset);
  const camera = ref.current?.object;

  useEffect(() => {
    if (!ref.current) return;
    if (!currentPreset) return;

    const { position, target } = currentPreset;

    const initialPosition = new THREE.Vector3(position.x, height, position.z);
    const initialTarget = new THREE.Vector3(target.x, height, target.z);

    camera.position.copy(initialPosition);
    ref.current.target.copy(initialTarget);

    ref.current.update();
  }, [ref, currentPreset]);

  return null;
}
