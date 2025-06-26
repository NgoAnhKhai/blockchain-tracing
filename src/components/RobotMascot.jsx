import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function RobotModel() {
  const group = useRef();
  const { scene, animations } = useGLTF("/dance_robot.glb");
  const mixer = useRef();

  useEffect(() => {
    if (animations && animations.length) {
      mixer.current = new THREE.AnimationMixer(scene);
      // Tự động play animation đầu tiên
      const action = mixer.current.clipAction(animations[0]);
      action.play();
    }
    return () => mixer.current?.stopAllAction();
  }, [scene, animations]);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1.4}
      position={[0, -1.3, 0]}
      rotation={[0, Math.PI / 12, 0]}
    />
  );
}

export default function RobotMascot() {
  return (
    <div
      style={{
        width: 340,
        height: 280,
        borderRadius: 22,
        overflow: "hidden",
      }}
    >
      <Canvas camera={{ position: [0, 1, 7], fov: 38 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 10, 8]} intensity={1.1} />
        <Suspense fallback={null}>
          <RobotModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
