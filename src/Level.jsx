import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Text, useGLTF } from "@react-three/drei";
import { useMemo, useState, useRef, useEffect } from "react";
import { THREEx } from "./threex.laserbeam";
import { LaserCooked } from "./threex.lasercooked";
import useGame from "./stores/useGame.jsx";
import { useObject } from "./objectContext.js";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

export function BlockStart({ position = [0, 0, 0] }) {
    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
                name="MyFloor"
            ></mesh>
        </group>
    );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
    const obstacle = useRef();
    const [speed] = useState(
        () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
    );

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
        obstacle.current.setNextKinematicRotation(rotation);
    });

    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />

            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}
/**
 * LaserBeam Component
 */
const LaserBeam = ({camera, playerObject3D }) => {
    console.log("laserBeeammmm")
    const object3d = useRef()
    const laserBeamRef = useRef()
    const ballPosition = useGame((state) => state.playerPosition);
    const [laserBeam, setLaserBeam] = useState(null)
    const RigidBodyComponent = useObject()
    const newLaserBeam = new THREEx.LaserBeam()
    var laserCooked = new LaserCooked(newLaserBeam,playerObject3D)   
      
    useEffect(() => {
        // Side effect code  
        
        newLaserBeam.object3d.position.x = -2
        newLaserBeam.object3d.position.y = 0.3
        newLaserBeam.object3d.position.z = 0.2
        
        // Cleanup function (optional)
        return () => {
            // Code to run when the component is unmounted or when dependencies change
        };
    }, [ballPosition, camera,laserBeam,THREEx,LaserCooked]);

    useFrame((state, delta) => {
        if (newLaserBeam) {
            //newLaserBeam.object3d.rotation.x += 2 * delta;
            const time = state.clock.elapsedTime; // Use elapsed time for animation
            const rotationValue = Math.sin(time) * 35;
            const rotationValue2 = Math.sin(time) * 15;
    
            newLaserBeam.object3d.rotation.y = (rotationValue * Math.PI) / 180;
            newLaserBeam.object3d.rotation.z = (Math.abs(rotationValue2 * Math.PI)) / 180;
            
            laserCooked.update(delta, time)
        }
        
    });
    return <RigidBody   colliders="hull"><primitive object={newLaserBeam.object3d} /></RigidBody>;
};
//LBC End

export function BlockLaser({ position = [0, 0, 0], camera = {}, playerObject3D } ) 
{  
    useEffect(() => {
        return () => {
            // Code to run when the component is unmounted or when dependencies change
        };
    }, [playerObject3D]);
     
    const [speed] = useState(
        () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
    );
    const boxRef = useRef();
    return (
        <group position={position}>
            {/* Floor */}
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
            <mesh ref={boxRef} position={[-2, 0, 0]} scale={[0.5, 1, 1]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <RigidBody   colliders="hull">
                <LaserBeam camera={camera} playerObject3D={playerObject3D} />
            </RigidBody>
        </group>
    );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
    const obstacle = useRef();
    const [speed] = useState(
        () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
    );
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const y = Math.sin(time + timeOffset) + 1.15;
        obstacle.current.setNextKinematicTranslation({
            x: position[0],
            y: position[1] + y,
            z: position[2],
        });
    });

    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}

export function BlockAxe({ position = [0, 0, 0] }) {
    const obstacle = useRef();
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const x = Math.sin(time + timeOffset) * 1.25;
        obstacle.current.setNextKinematicTranslation({
            x: position[0] + x,
            y: position[1] + 0.75,
            z: position[2],
        });
    });

    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[1.5, 1.5, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}

export function BlockEnd({ position = [0, 0, 0] }) {
    const hamburger = useGLTF("./hamburger.glb");
    hamburger.scene.children.forEach((mesh) => {
        mesh.castShadow = true;
    });

    return (
        <group position={position}>
            <Text
                font="./bebas-neue-v9-latin-regular.woff"
                scale={2}
                position={[0, 1.25, 2]}
            >
                FINISH
                <meshBasicMaterial toneMapped={false} />
            </Text>
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                position={[0, 0, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
            <RigidBody type="fixed" colliders="hull">
                <primitive object={hamburger.scene} scale={0.2} />
            </RigidBody>
        </group>
    );
}

function Bounds({ length = 1 }) {
    return (
        <>
            <RigidBody type="fixed" restitution={0.2} friction={0}>
                <mesh
                    position={[2.15, 0.75, -(length * 2) + 2]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[0.3, 1.5, 4 * length]}
                    castShadow
                />
                <mesh
                    position={[-2.15, 0.75, -(length * 2) + 2]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[0.3, 1.5, 4 * length]}
                    receiveShadow
                />
                <mesh
                    position={[0, 0.75, -(length * 4) + 2]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[4, 1.5, 0.3]}
                    receiveShadow
                />
                <CuboidCollider
                    args={[2, 0.1, 2 * length]}
                    position={[0, -0.1, -(length * 2) + 2]}
                    restitution={0.2}
                    friction={1}
                />
            </RigidBody>
        </>
    );
}

export function Level({
    count = 5,
    types = [BlockSpinner, BlockAxe, BlockLimbo],
    seed = 0,
    playerObject3D
}) {

    let test = playerObject3D
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
            <BlockStart position={[0, 0, 0]} />
            {/* <BlockLaser position={[0, 0, -4]}  playerObject3D={playerObject3D}/> */}
            { blocks.map((Block,index)=> <Block  key={ index } position={[0,0,-(index+1)*4 ]} />)}
            <BlockEnd position={[0, 0, -(count + 1) * 4]} />
            {/* <BlockEnd position={[0, 0, -(1 + 1) * 4]} /> */}
            <Bounds length={count + 2} />
        </>
    );
}
