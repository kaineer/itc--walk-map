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
import { useRef } from 'react';
import { FixedHeightCamera } from './components/camera/FixedHeightCamera';
import { KeyboardControls } from './components/camera/KeyboardControls';
import { StorePresetControls } from './components/camera/StorePresetControls';
import { FollowCurrentPreset } from './components/camera/FollowCurrentPreset';
import { type Building as BuildingData } from './hooks/buildings/buildings';

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
  const ref = useRef<typeof OrbitControls | null>(null);

  const fixedHeight = 1.8;

  const mv = middle ?
    // new THREE.Vector3(middle.x, 0, middle.z) :
    new THREE.Vector3(1057, fixedHeight, 648) :
    new THREE.Vector3(0, 0, 0);
  const mx = mv.x;
  const mz = mv.z;

  const makeBuilding = (building: BuildingData, id: number) => (
    <Building key={ id } building={ building } />
  );

  return (
    <Provider store={setupStore()}>
      <div id="canvas-container">
        <Canvas camera={{ position: [823, fixedHeight, 895] }}>
          <ambientLight intensity={0.99} />
          <directionalLight color="white" position={[0, 0, 5]} />
          { buildings.map(makeBuilding) }
          <BlenderBuilding
            modelPath='https://docs.maptiler.com/sdk-js/assets/34M_17/34M_17.gltf'
            point={{ x: 1380, z: 2424 }}
            scale={1}
          />
          <mesh position={[mx, 0, mz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100000, 100000]} />
            <meshStandardMaterial color={ floorColor } side={2} />
          </mesh>

          <OrbitControls
            target={[824, fixedHeight, 895]}
            ref={ref}>
            <FixedHeightCamera ref={ref} height={fixedHeight} />
            <KeyboardControls ref={ref} />
            <StorePresetControls ref={ref} />
            <FollowCurrentPreset ref={ref} height={fixedHeight} />
          </OrbitControls>
        </Canvas>
        <Popup />
      </div>
    </Provider>
  )
}

export default App
