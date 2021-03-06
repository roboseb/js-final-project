import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useLoader} from "@react-three/fiber";
import { MinEquation, TextureLoader } from 'three';
import { MeshLambertMaterial } from "three";
import { BoxBufferGeometry } from "three";

import {animateMining, animateBeam, animateMiss, animateTimerExpired} from "../animations";

import ProgressRing from '../ProgressRing';

import uniqid from "uniqid";

import tenshiGif from "../../art/tenshi.gif";
import rodGif from "../../art/rod_ani.gif";

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
                props.mine(e, props.color);
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

// const MiningAnimation = (props) => {

//     // const [gif, setGif] = useState(rodGif);
//     // const [loaded, setLoaded] = useState(rodGif);
//     // const [gifLoaded, setGifLoaded] = useState(false);


//     // const reloadGif = () => {
//     //     if (gifLoaded === true) return;

//     //     setGifLoaded(true);

//     //     setLoaded('');
//     //     setTimeout(() => {
//     //         console.log('reloaded')
//     //         setLoaded(gif)
//     //     }, 50);
//     // }

//     const [loaded, setLoaded] = useState('rodGif');


//     return (
//         <img 
//             onLoad={reloadGif}
//             src={loaded} 
//             id='mininganimation' 
//             alt=""
//             style={{
//                 top: props.top,
//                 left: props.left,
//                 height: props.height
//             }}
//         ></img>
//     );
// }

const Clicker = (props) => {
    const [coinMultiplier, setCoinMultiplier] = useState(1);
    const [autoMoon, setAutoMoon] = useState(false);

    const [markers, setMarkers] = useState([]);
    const [vessel, setVessel] = useState([]);

    const [bluePercent, setBluePercent] = useState(0);
    const [blackPercent, setBlackPercent] = useState(0);

    const [inventory, setInventory] = useState({
        gnoxide: 0,
        carbonant: 0
    });

    const [counter, setCounter] = useState(0);
    const [timer, setTimer] = useState(null);

    //Add a new marker to the planet.
    const addMarkers = () => {

        clearTimeout(timer);

        const planet = document.getElementById('planet');
        const planetWidth = planet.offsetWidth;

        let tempMarkers = [];

        //Add a blue marker everytime.
        tempMarkers = (tempMarkers.concat(blueMarker()));

        if (roll(50) === true) {
            console.log('adding red');
            tempMarkers = (tempMarkers.concat(blackMarker()));
        }
        

        setMarkers(tempMarkers);

        //Remove all markers and add a new one after a given time.
        setTimer(setTimeout(() => {
            handleTimerExpired();
        }, 1050));
    }

    //Handle a click that doesn't hit a marker.
    const handleMiss = () => {
        animateMiss();

        setVessel([]);
        setBluePercent(0);
        setBlackPercent(0);
    }

    //Handle various actions when no marker is clicked with the time.
    const handleTimerExpired = () => {
        clearTimeout(timer);
        addMarkers();

        setVessel([]);
        setBluePercent(0);
        setBlackPercent(0);

        animateTimerExpired();
    }

    //Get dimensions and color for creating a blue marker.
    const blueMarker = () => {
        const [top, left] = randomPosition(25);

        return {
            top: top,
            left: left,
            width: '50px',
            height: '50px',
            color: 'blue'
        }
    }

    //Get dimensions and color for creating a red marker.
    const blackMarker = () => {
        const [top, left] = randomPosition(15);

        return {
            top: top,
            left: left,
            width: '30px',
            height: '30px',
            color: 'black'
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

    const mine = (e, color) => {

        animateMining(e);

        addToVessel(color);
    }

    //Roll a 100-sided die and return whether it is less than or
    //equal to the given percentChance.
    const roll = (percentChance) => {
        const diceRoll = Math.round(Math.random() * 100);
        let outcome;

        if (diceRoll <= percentChance) {
            outcome = true;
        } else {
            outcome = false;
        }

        return outcome;
    }

    const addToVessel = (color) => {
        let tempVessel = vessel;
        tempVessel.push(color);

        let blue = 0;
        let black = 0;

        tempVessel.forEach(element => {
            if (element === 'blue') {
                blue++;
            } else if (element === 'black') {
                black++
            }
        });

        let newVessel = [];

        for (let i = 0; i < blue; i++) {
            newVessel.push('blue');
        }

        for (let i = 0; i < black; i++) {
            newVessel.push('black');
        }

        //Take in color percentages and craft according recipes.
        processColorRatio(blue, black);

        //Update color percentages.
        setBluePercent(Math.round(blue/tempVessel.length * 100));
        setBlackPercent(Math.round(black/tempVessel.length * 100));

        setVessel(newVessel);
    }    

    //Check the vessel to see if anything has been crafted.
    const processColorRatio = (blue, black) => {
        let tempInv = inventory;

        //Add one gnoxide to inventory.
        if (blue === black) {
            tempInv.gnoxide += 1;
            setInventory(tempInv);

        //Add one carbonant to inventory.
        } else if (black > 5 && blue === 0) {
            tempInv.carbonant += 1;
            setInventory(tempInv);
        }
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
                <div id='vessel'>
                    <div id='percentages'>
                        {bluePercent}% {blackPercent}%
                    </div>
                    
                    {vessel.map((item) => {
                        return (<div className='vesselcolor' style={{backgroundColor: item}}></div>)
                    })}
                </div>
                <div id='planet'
                    onClick={(e) => {
                        addMarkers();
                        

                        if (e.target.id === 'planet') {
                            console.log('miss');
                            handleMiss();
                        }
                        
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


                                />
                    })}




                </div>
            </div>
        </div>
    );
}

export default Clicker;