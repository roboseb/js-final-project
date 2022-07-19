import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from 'three';
import { MeshLambertMaterial } from "three";
import { BoxBufferGeometry } from "three";

function Box(props) {
    const colorMap = useLoader(TextureLoader, "PavingStones092_1K_Color.jpg")

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const [rValue, setRValue] = useState(0.05)

    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (ref.current.rotation.y += rValue));
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={ref}
        scale={2}
        onClick={(event) => {
            click(!clicked);
            setRValue(rValue * -1);
            console.log(clicked);
        }}
        onPointerOver={(event) => {
            hover(true);
            console.log(hovered);
            
        }}
        onPointerOut={(event) => hover(false)}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial map={colorMap} />
      </mesh>
    )
  }


const Clicker = () => {
    return (
        <div id='clicker'>
            <h1>Clicker</h1>
            <Canvas style={{backgroundColor: 'white'}}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Box />
            </Canvas>
 
        </div>
    );
}

export default Clicker;