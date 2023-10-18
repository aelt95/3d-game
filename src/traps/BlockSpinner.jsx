import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const BlockSpinner = ({ position, geometry, material }) => {
  const obstacleRef = useRef();
  const [speed] = useState(
    () => (Math.random() + 0.5) * (Math.random() < 0.5 ? -1 : 1)
  );

  //Rotate spinner (Quaternion)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacleRef.current.setNextKinematicRotation(rotation);
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
        scale={[3.5, 0.3, 0.3]}
      />
    </RigidBody>
  );
};

export default BlockSpinner;
