import * as THREE from "three";
// import { Perf } from "r3f-perf";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { useGLTF, Float, Text } from "@react-three/drei";
import BlockSpinner from "./traps/BlockSpinner.jsx";
import BlockVerticalDoor from "./traps/BlockVerticalDoor.jsx";
import BlockAxe from "./traps/BlockAxe.jsx";
import BoundsWall from "./traps/BoundsWall.jsx";

/* 1 Geo, 1 Material = +Performance */
const boxGeo = new THREE.BoxGeometry();

const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

const BlockStart = ({ position, scale, material, children }) => {
  return (
    /* Floor */
    <group>
      <mesh
        receiveShadow
        geometry={boxGeo}
        material={material}
        scale={scale}
        position={position}
      ></mesh>
      {children}
    </group>
  );
};

const BlockEnd = ({ position, scale, material }) => {
  const { scene, nodes } = useGLTF("./scene.gltf");
  Object.entries(nodes).map((node) => {
    node[1].castShadow = true;
  });
  return (
    /* Floor */
    <group>
      <RigidBody>
        <mesh
          receiveShadow
          geometry={boxGeo}
          material={material}
          scale={scale}
          position={position}
        ></mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="hull" restitution={0.2} friction={0}>
        <primitive
          object={scene}
          position={[0, 0.1, position[2]]}
          scale={0.5}
        />
      </RigidBody>
    </group>
  );
};

export const Level = ({
  count = 25,
  types = [BlockAxe, BlockSpinner, BlockVerticalDoor],
  seed = 0,
}) => {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  return (
    <>
      {/* <Perf position="top-left" /> */}
      <Float>
        <Text
          font="./bebas-neue-v9-latin-regular.woff"
          scale={0.4}
          position={[0.95, 0.65, 0]}
          rotation-y={-0.4}
          onClick={() =>
            window.open("https://aelt-portfolio.vercel.app/", "_blank")
          }
        >
          {"<Aelt/>"}
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <BlockStart
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        material={floor1Material}
      />
      {blocks.map((Block, i) => {
        return (
          <BlockStart
            key={i}
            position={[0, -0.1, -(i + 1) * 4]}
            scale={[4, 0.2, 4]}
            material={floor2Material}
          >
            <Block
              position={[0, 0.3, -(i + 1) * 4]}
              scale={[3.5, 0.3, 0.3]}
              geometry={boxGeo}
              material={obstacleMaterial}
            />
          </BlockStart>
        );
      })}
      <BlockEnd
        position={[0, 0, -count * 4 - 4]}
        scale={[4, 0.2, 4]}
        material={floor1Material}
      />
      <BoundsWall length={count} geometry={boxGeo} material={wallMaterial} />
      <Float floatIntensity={0.1} rotationIntensity={0.1}>
        <Text
          font="./bebas-neue-v9-latin-regular.woff"
          scale={1.5}
          position={[0, 2.5, -count * 4 - 4]}
        >
          {"Finish"}
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
    </>
  );
};
