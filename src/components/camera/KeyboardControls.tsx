import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three';

interface Props {
  ref: RefObject<OrbitControls>;
}

export const KeyboardControls = ({ ref }: Props) => {
  const controlsRef = ref;
  const moveSpeed = 50;

  const keysToTrack = 'ws';
  const initialState = keysToTrack
    .split('')
    .reduce((obj, k) => ({...obj, [k]: false}), {});
  const keysRef = useRef(initialState);

  // Обработчик нажатия клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keysToTrack.includes(key)) keysRef.current[key] = true;
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keysToTrack.includes(key)) keysRef.current[key] = false;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, []);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const { w, s } = keysRef.current;
    const moveDirection = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();

    const camera = controlsRef.current.object;

    // Получаем направление камеры в плоскости XZ
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    // Движение вперед (W) и назад (S)
    if (w) moveDirection.add(cameraDirection);
    if (s) moveDirection.sub(cameraDirection);

    // Нормализуем и применяем скорость
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      camera.position.addScaledVector(moveDirection, moveSpeed * delta);
    }

    if (!w && !s) {
      moveDirection.setScalar(0);
    }

    // Обновляем OrbitControls
    if (moveDirection.length() > 0) {
      controlsRef.current.target.copy(camera.position).add(cameraDirection);
    }
  });

  return null;
}
