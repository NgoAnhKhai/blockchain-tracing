import React, {
  Suspense,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function WalkingRobotModel({ containerWidth }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/walking.glb");
  const mixer = useRef();
  // Đổi phạm vi posX cho rộng hơn theo width container
  const [limit, setLimit] = useState({ left: -2, right: 2 });

  useEffect(() => {
    if (containerWidth) {
      // Quy đổi px ra đơn vị trong 3D (cứ 320px ~ 4 đơn vị, bạn scale theo width thực tế)
      const units = (containerWidth / 320) * 4; // scale cho 320px = 4 units
      setLimit({ left: -units / 2 + 0.9, right: units / 2 - 0.9 });
    }
  }, [containerWidth]);

  useEffect(() => {
    if (animations && animations.length) {
      mixer.current = new THREE.AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[0]);
      action.play();
      return () => {
        if (mixer.current) mixer.current.stopAllAction();
      };
    }
  }, [animations, scene]);

  // Bắt đầu từ bên trái
  const posX = useRef(limit.left);

  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta);
    posX.current += delta * 2; // tốc độ, tăng số này cho nhanh
    if (posX.current > limit.right) posX.current = limit.left;
    if (group.current) group.current.position.x = posX.current;
  });

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={1.2}
        position={[0, -1.25, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}

export default function WalkingRobotAcross() {
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(520); // default width

  useLayoutEffect(() => {
    // Lấy width thực tế của div
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: 520, // hoặc "100%" nếu responsive, nhớ set luôn maxWidth
        height: 180,
        borderRadius: 18,
        overflow: "hidden",
        background: "none",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <Canvas camera={{ position: [0, 1.2, 5], fov: 38 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 10, 8]} intensity={1.1} />
        <Suspense fallback={null}>
          <WalkingRobotModel containerWidth={containerWidth} />
        </Suspense>
      </Canvas>
    </div>
  );
}
