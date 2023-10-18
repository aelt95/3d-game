import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

const BlockVerticalDoor = ({ position, scale, geometry, material }) => {
  const obstacleRef = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  //Traslating positionY
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const vectorY = Math.sin(time + timeOffset) + 1.15;
    obstacleRef.current.setNextKinematicTranslation({
      x: 0,
      y: vectorY,
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
        scale={scale}
      />
    </RigidBody>
  );
};

export default BlockVerticalDoor;
