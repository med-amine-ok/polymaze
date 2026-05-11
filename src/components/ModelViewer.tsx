"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model = () => {
  const gltf = useGLTF("/3d.glb");
  return <primitive object={gltf.scene} scale={1.35} />;
};

const ModelViewer = () => {
  return (
    <>
      <style>
        {`
          .model-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none; /* Let clicks pass through if needed, or remove if interactive */
          }
        `}
      </style>

      <div className="model-container" style={{ pointerEvents: 'auto' }}>
        <Canvas camera={{ position: [2, 3, 4], fov: 40 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[0, 3, 10]} intensity={2} />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={2} 
            enableDamping 
            dampingFactor={0.05} 
          />
        </Canvas>
      </div>
    </>
  );
};

export default ModelViewer;
