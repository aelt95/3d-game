import { RigidBody, CuboidCollider } from "@react-three/rapier";

const BoundsWall = ({ length = 1, geometry, material }) => {
  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <mesh
        geometry={geometry}
        material={material}
        position={[2.15, 0.55, -length * 2 - 2]}
        scale={[0.3, 1.5, 4 * (length + 2)]}
        castShadow
      ></mesh>
      <mesh
        geometry={geometry}
        material={material}
        position={[-2.15, 0.55, -length * 2 - 2]}
        scale={[0.3, 1.5, 4 * (length + 2)]}
        receiveShadow
      ></mesh>
      <mesh
        geometry={geometry}
        material={material}
        position={[0, 0.55, -(length * 4) - 6.15]}
        scale={[4, 1.5, 0.3]}
        receiveShadow
      ></mesh>
      <CuboidCollider
        args={[2, 0.1, 2 * length + 4]}
        position={[0, -0.1, -length * 2 - 2]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  );
};

export default BoundsWall;
