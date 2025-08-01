import './App.css'

import { Canvas } from '@react-three/fiber'
import { useBuildings } from './hooks/buildings/hook'
import { Bounds, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Building } from './components/Building';
import * as THREE from 'three'
import { FixedHeightControls } from './components/FixedHeightControls';
import { BlenderBuilding } from './components/BlenderBuilding';
import { Popup } from './components/Popup';
import { setupStore } from './store';
import { Provider } from 'react-redux';
import { CameraPositionLogger } from './components/camera/CameraPositionLogger';
import { useRef } from 'react';
import { FixedHeightCamera } from './components/camera/FixedHeightCamera';
import { KeyboardControls } from './components/camera/KeyboardControls';
import { StorePresetControls } from './components/camera/StorePresetControls';
import { FollowCurrentPreset } from './components/camera/FollowCurrentPreset';

function App() {
  const { buildings, middle } = useBuildings();

  // const middle = { x: 0, y: 0, tags: {}, id: 0 };
  // const buildings = [
  //   {
  //     height: 10,
  //     nodes: [
  //       { x: 0, z: 0, tags: {}, id: 0 },
  //       { x: 20, z: 0, tags: {}, id: 0 },
  //       { x: 40, z: 20, tags: {}, id: 0 },
  //       { x: 30, z: 20, tags: {}, id: 0 },
  //       { x: 20, z: 10, tags: {}, id: 0 },
  //       { x: 0, z: 10, tags: {}, id: 0 },
  //     ],
  //     tags: {}
  //   }
  // ];
  //

  const floorColor = "#ffffe5";
  const ref = useRef<any>(null);

  const mv = middle ?
    // new THREE.Vector3(middle.x, 0, middle.z) :
    new THREE.Vector3(1057, 1.8, 648) :
    new THREE.Vector3(0, 0, 0);
  const mx = mv.x;
  const mz = mv.z;

  const makeBuilding = (building: Building, id: number) => (
    <Building key={ id } building={ building } />
  );

  return (
    <Provider store={setupStore()}>
      <div id="canvas-container">
        <Canvas camera={{ position: [823, 1.8, 895] }}>
          <ambientLight intensity={0.99} />
          <directionalLight color="white" position={[0, 0, 5]} />
          { buildings.map(makeBuilding) }
          <BlenderBuilding
            modelPath='https://docs.maptiler.com/sdk-js/assets/34M_17/34M_17.gltf'
            point={{ x: 1380, z: 2424 }}
            scale={1}
          />
          <mesh position={[mx, 0, mz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100000, 100000]} /> {/* Размер 100x100 метров */}
            <meshStandardMaterial color={ floorColor } side={2} />
          </mesh>

          <OrbitControls
            position={[823, 1.8, 895]}
            target={[824, 1.8, 895]}
            ref={ref}>
            <FixedHeightCamera ref={ref} height={1.8} />
            <KeyboardControls ref={ref} />
            <StorePresetControls ref={ref} />
            <FollowCurrentPreset ref={ref} />
          </OrbitControls>
        </Canvas>
        <Popup />
      </div>
    </Provider>
  )
}

export default App
