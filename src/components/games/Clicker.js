import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useLoader} from "@react-three/fiber";
import { MinEquation, TextureLoader } from 'three';
import { MeshLambertMaterial } from "three";
import { BoxBufferGeometry } from "three";

import ProgressRing from '../ProgressRing';

import uniqid from "uniqid";

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

        
    }

    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => {
        //ref.current.rotation.y += rValue;

        //Animate the planet being clicked.
        if (clicked) {
            if (scale < 0.5) {
                setScaleFactor(0.1);
            }
            setScale(scale + scaleFactor);
        } else {
            setScaleFactor(-0.1);
            setScale(2.6);
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
            position={[0, 8, 0]}
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
                : <meshStandardMaterial color='hotpink' />}

            {!props.autoMoon ? null
                : <ambientLight intensity={0.5} />}
        </mesh>
    )
}

const Marker = (props) => {
    return (
        <div 
            className='marker'
            style={{top: props.top, 
                    left: props.left,
                    height: props.height,
                    width: props.width,
                    backgroundColor: props.color}}
            onClick={(e) => {
                props.mine(props.color);
                props.animateMarker(e);
                clearTimeout(props.timer);
            }}
        >
            <ProgressRing
                radius={props.height.split('p')[0]}
                stroke={4}
                progress={props.progress}
            />
        </div>
    );
}



const Clicker = (props) => {
    const [coinMultiplier, setCoinMultiplier] = useState(1);
    const [autoMoon, setAutoMoon] = useState(false);

    const [markers, setMarkers] = useState([]);
    const [counter, setCounter] = useState(0);
    const [timer, setTimer] = useState(null);

    //Add a new marker to the planet.
    const addMarker = () => {

        clearTimeout(timer);

        const planet = document.getElementById('planet');
        const planetWidth = planet.offsetWidth;

        let tempMarkers = markers;
        tempMarkers.splice(-1, 1);

        const [top, left] = randomPosition(20);
        
        const info = blueMarker();

        setMarkers(tempMarkers.concat({
            top: top,
            left: left,
            width: info.width,
            height: info.height,
            color: info.color,

        }));

        //Remove all markers and add a new one after a given time.
        setTimer(setTimeout(() => {
            
            removeMarkers();
            addMarker();
            

        }, 1050));
    }

    

    //Get dimensions and color for creating a blue marker.
    const blueMarker = () => {
        return {
            width: '50px',
            height: '50px',
            color: 'blue'
        }
    }

    //Remove all markers.
    const removeMarkers = () => {   


        setMarkers(markers => []);
        setCounter(counter + 1);
    }

    //Return a random XY position within the planet given a radius.
    const randomPosition = (markerRadius) => {
        let posX, posY;

        const planet = document.getElementById('planet');
        const planetRadius = planet.offsetWidth / 2;

        do {
            posX = Math.floor(Math.random() * ((planetRadius * 2) - 1));
            posY = Math.floor(Math.random() * ((planetRadius * 2) - 1));
        } while (Math.sqrt(Math.pow(planetRadius - posX, 2) + Math.pow(planetRadius - posY, 2)) > planetRadius - markerRadius)

        return [posX, posY]
    }

    const mine = (color) => {
        //console.log(color);
    }

    //THIS OBVIOUSLY DOES NOTHING BECAUSE THE MARKER IS IMMEDIATELY REMOVED ON CLICK
    const animateMarker = (e) => {
        console.log(e.target);
        e.target.classList.add('clicked');
        e.target.style.border = '5px solid green'
    }

    return (
        <div id='clicker'>
            <div id='clickerheader'>
                <h1>Clicker</h1>
                <h1>x{coinMultiplier}</h1>
            </div>

            <div id='tenshibox'>
                <img id='icon' src={props.icon} alt=""></img>
                <img id='tenshi' src={tenshiGif} alt=""></img>
            </div>
            
            {/* <Canvas style={{backgroundColor: 'white'}}>
                <ambientLight intensity={0.5} />
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
            </Canvas> */}

            <div id='gamebox'>
                <button onClick={removeMarkers} >Remove Markers</button>
                <div id='planet'
                    onClick={() => {
                        removeMarkers();
                        addMarker();
                        
                    }}>
                    {markers.map((item) => {
                        return <Marker 
                                    key={uniqid()}
                                    top={item.top}
                                    left={item.left}
                                    width={item.width}
                                    height={item.height}
                                    color={item.color}
                                    mine={mine}
                                    timer={timer}
                                    setTimer={setTimer}
                                    animateMarker={animateMarker}


                                />
                    })}

                </div>


            </div>
 
        </div>
    );
}

export default Clicker;