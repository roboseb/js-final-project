import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useLoader} from "@react-three/fiber";
import { MinEquation, TextureLoader } from 'three';
import { MeshLambertMaterial } from "three";
import { BoxBufferGeometry } from "three";

import tenshiGif from "../../art/tenshi.gif";

function Planet(props) {

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()

    const groundMap = useLoader(TextureLoader, "Ground037_1K_Color.jpg");
    const waterMap = useLoader(TextureLoader, "photos_2018_7_16_fst_water-ripple.jpg")

    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const [rValue, setRValue] = useState(0.05)

    const [scale, setScale] = useState(1.7);
    const [scaleFactor, setScaleFactor] = useState(-0.1)

    const [shaderMode, setShaderMode] = useState(false);

    const [water, setWater] = useState(false);


    //Animate the planet being clicked.
    const animatePlanetClick = () => {
        click(true);
        setTimeout(() => {
            click(false)
        }, 150);
    }

    //Mine for a randomly chosen resource.
    const mine = () => {
        //Roll to decide mining outcome.

        const roll = Math.round(Math.random() * 100);

        //console.log(roll);

        if (roll > 90) {
            togglePlanetMode();
        } else if (roll > 70) {
            console.log('auto moon activated')

            props.setAutoMoon(true);
            setTimeout(() => {
                //props.setAutoMoon(false);
            }, 2000)
        } else {
            const coins = (Math.floor(Math.random() * 2) + 1) * props.coinMultiplier;
            props.updateCoins(coins);

            console.log('coins:' + coins);
        }
        
    }

    //Toggle the planet's texture and multiplier
    const togglePlanetMode = () => {
        setWater(!water);

        if (!water) {
            props.setCoinMultiplier(2);
        } else {
            props.setCoinMultiplier(1);
        }

        //console.log(water);
    }

    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => {
        ref.current.rotation.y += rValue;

        //Animate the planet being clicked.
        if (clicked) {
            if (scale < 0.5) {
                setScaleFactor(0.1);
            }
            setScale(scale + scaleFactor);
        } else {
            setScaleFactor(-0.1);
            setScale(1.7);
        }

        //Add coins for auto moon if the powerup is active.
        if (props.autoMoon) {
            const roll = Math.floor(Math.random() * 6);
            console.log('roll: ' + roll);

            if (roll === 5) {
                props.updateCoins(1);
            }
        }

    });

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={scale}
            position={[0, -1.2, 0]}
            onClick={(event) => {
                click(!clicked);
                animatePlanetClick();
                mine();
            }}
            onPointerOver={(event) => {
                hover(true);

            }}
            onPointerOut={(event) => hover(false)}>
            <sphereGeometry args={[1, 8, 8, 0]} />
            <meshStandardMaterial map={water ? waterMap : groundMap} />
        </mesh>
    )
}

function Moon(props) {
    const colorMap = useLoader(TextureLoader, "Ground054_1K_Color.jpg")

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const [rValue, setRValue] = useState(0.05)

    var orbitRadius = 2; // for example
    const [date, setDate] = useState(0);

    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => {

        //Rotate the moon.
        ref.current.rotation.y += rValue;

        //Orbit the moon around the planet.
        setDate(Date.now() * 0.0008);
        ref.current.position.set(
            Math.cos(date) * orbitRadius,
            0,
            Math.sin(date) * orbitRadius
          );
    });





    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={0.5}
            position={[0, 0.5, 0]}
            onClick={(event) => {
                click(!clicked); 
            }}
            onPointerOver={(event) => {
                hover(true);
                console.log(hovered);

            }}
            onPointerOut={(event) => hover(false)}>
            <sphereGeometry args={[1, 8, 8, 0]} />
            {!props.autoMoon ? <meshStandardMaterial map={colorMap} />
            : <meshStandardMaterial color="white"  />}

        </mesh>
    )
}


const Clicker = (props) => {
    const [coinMultiplier, setCoinMultiplier] = useState(1);
    const [autoMoon, setAutoMoon] = useState(false);

    return (
        <div id='clicker'>
            <h1>Clicker</h1>
            <h1>{coinMultiplier}</h1>
            <div id='tenshibox'>
                <img id='icon' src={props.icon} alt=""></img>
                <img id='tenshi' src={tenshiGif} alt=""></img>
            </div>
            
            <Canvas style={{backgroundColor: 'white'}}>
                <ambientLight intensity={0} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Planet 
                    coinMultiplier={coinMultiplier}
                    setCoinMultiplier={setCoinMultiplier}
                    updateCoins={props.updateCoins}
                    autoMoon={autoMoon}
                    setAutoMoon={setAutoMoon}
                />
                <Moon 
                    autoMoon={autoMoon}
                />
            </Canvas>
 
        </div>
    );
}

export default Clicker;