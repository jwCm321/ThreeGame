import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import { ObjectProvider } from './objectContext.js';
import { Physics } from '@react-three/rapier'
import useGame from './stores/useGame.jsx'
import { useFrame, useThree } from '@react-three/fiber'
import { useState } from "react";

export default function Experience(camera)
{

    const [playerObject3D, setPlayerObject3D] = useState(null);
    const blocksCount = useGame((state)=>state.blocksCount)
    const blocksSeed = useGame(state => state.blocksSeed)
    
    return <>
        
         <color args={ [ '#bdedfc' ] } attach="background" />
        <OrbitControls makeDefault /> 
        <Physics >
            <Lights />
            <Level count={blocksCount} seed={ blocksSeed } playerObject3D={playerObject3D}/>
            <Player setPlayerObject3D={setPlayerObject3D} />
        </Physics>      

    </>
}