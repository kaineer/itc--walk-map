import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';

interface Props {
  ref: RefObject<any>;
  height: number; // Фиксированная высота (1.8 м)
}

export const FixedHeightCamera = ({ ref, height = 1.8 }: Props) => {
  const controlsRef = ref;
  const cameraHeight = height;

  const { camera } = useThree();

  useFrame(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;

      // Фиксируем высоту камеры
      camera.position.y = cameraHeight;

      // Ограничиваем движение по вертикали (minPolarAngle и maxPolarAngle)
      controls.minPolarAngle = 0.1; // Не смотреть под ноги (0 = горизонтально)
      controls.maxPolarAngle = 1.5 * (Math.PI / 2); // Не смотреть в небо (90° вверх)

      // Отключаем увеличение/уменьшение (zoom)
      controls.enableZoom = false;
    }
  });

  return null;
}
