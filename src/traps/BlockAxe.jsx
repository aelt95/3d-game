import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

const BlockAxe = ({ position, geometry, material }) => {
  const obstacleRef = useRef();
  const [timeOffset] = useState(() => Math.random() * 4);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const vectorY = Math.sin(time + timeOffset) * 1.25;
    obstacleRef.current.setNextKinematicTranslation({
      x: vectorY,
      y: 0.7,
      z: position[2],
    });
  });

  return (
    <RigidBody
      ref={obstacleRef}
      type="kinematicPosition"
      restitution={0.2}
      friction={0}
      position={position}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={geometry}
        material={material}
        scale={[1.5, 1.5, 0.3]}
      />
    </RigidBody>
  );
};

export default BlockAxe;
