import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import { cameraPresetsSlice } from "../../store/slices/cameras";
import { useDispatch } from "react-redux";

interface Props {
  ref: RefObject<any>;
}

export const StorePresetControls = ({ ref }: Props) => {
  const controlsRef = ref;
  const { addPreset } = cameraPresetsSlice.actions;
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === ' ') {
        const camera = controlsRef.current.object;
        const t = controlsRef.current.target;
        const p = camera.position;

        const target = {x: t.x, z: t.z };
        const position = {x: p.x, z: p.z};

        dispatch(addPreset({ position, target }));
      }
    }

    window.addEventListener('keypress', handleKeyPress);

    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return null;
}
