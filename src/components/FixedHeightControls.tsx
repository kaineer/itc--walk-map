import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  target: THREE.Vector3;
  ref: RefObject<any>;
}

export const FixedHeightControls = ({ target, ref }: Props) => {
  const controlsRef = ref;
  const cameraHeight = 1.8; // Фиксированная высота (1.8 м)

  const { camera } = useThree();
  const moveSpeed = 50;

  const keysRef = useRef({
    w: false,
    s: false,
  });

  // Обработчик нажатия клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') keysRef.current.w = true;
      if (e.key.toLowerCase() === 's') keysRef.current.s = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') keysRef.current.w = false;
      if (e.key.toLowerCase() === 's') keysRef.current.s = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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

  // Движение камеры в useFrame
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const { w, a, s, d } = keysRef.current;
    const moveDirection = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();

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

    // Фиксируем высоту
    camera.position.y = cameraHeight;

    // Обновляем OrbitControls
    if (moveDirection.length() > 0) {
      controlsRef.current.target.copy(camera.position).add(cameraDirection);
    }
  });

  return null;
};
