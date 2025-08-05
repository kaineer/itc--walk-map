import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef, type RefObject } from 'react';

interface Props {
  ref: RefObject<OrbitControls>;
  height?: number;
}

export const FixedHeightCamera = ({ ref, height = 1.8 }: Props) => {
  useFrame(() => {
    if (ref.current) {
      const controls = ref.current;
      const camera = controls.object;

      // Фиксируем высоту камеры
      camera.position.y = height;

      // Ограничиваем движение по вертикали (minPolarAngle и maxPolarAngle)
      controls.minPolarAngle = 0.1; // Не смотреть под ноги (0 = горизонтально)
      controls.maxPolarAngle = 1.5 * (Math.PI / 2); // Не смотреть в небо (90° вверх)

      // Отключаем увеличение/уменьшение (zoom)
      controls.enableZoom = false;
    }
  });

  return null;
}
