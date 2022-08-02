import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useLoader} from "@react-three/fiber";
import { MinEquation, TextureLoader } from 'three';
import { MeshLambertMaterial } from "three";
import { BoxBufferGeometry } from "three";

import {animateMining, animateBeam, animateMiss, animateSuccess, 
        animateTimerExpired, toggleUseButton, toggleNavbar,
        showInventory, crackPlanet, sealPlanet, animateSmallChest,
        showRecipes} from "../animations";

import ProgressRing from '../ProgressRing';

import uniqid from "uniqid";

import tenshiGif from "../../art/tenshi.gif";
import rodGif from "../../art/rod_ani.gif";
import gnoxideImg from "../../art/gnoxide.png";
import carbonantImg from "../../art/carbonant.png";
import dioxidolatryImg from "../../art/dioxidolatry.png";
import coinImg from "../../art/coin.png";
import placeholder from "../../art/placeholder.png";

import recipe1 from "../../art/recipe1.png";

import smallChest1 from "../../art/smallchest1.png"
import smallChest2 from "../../art/smallchest2.png"


import { findAllByPlaceholderText } from '@testing-library/dom';

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
    console.log('rendered!');

    return (
        <div 
            className='marker'
            style={{top: props.top, 
                    left: props.left,
                    height: props.height,
                    width: props.width,
                    backgroundColor: props.color}}
            onClick={(e) => {

                // Perform regular mining if not a green marker.
                if (!props.number && props.color !== 'orange') {
                    props.mine(e, props.color);
                    clearTimeout(props.timer);
                    props.addMarkers();

                // Don't add new markers if clicked was orange.
                } else if (props.color === 'orange') {
                    props.mine(e, props.color);
                    clearTimeout(props.timer);

                //Increase green clicked if green marker.
                } else {    
                    e.target.classList.add('greenclicked');

                    //Count clicked green markers currently visible.
                    const clickedGreens = Array.from(document.querySelectorAll('.greenclicked'));
                    if (clickedGreens.length >= 2) {
                        console.log('got it!');
                        props.mine(e, props.color);
                        clearTimeout(props.timer);
                        props.addMarkers();
                    }
                }
            }}
        >
            {/* <div>{props.number}</div> */}
            <ProgressRing
                radius={props.height.split('p')[0]}
                stroke={4}
                progress={props.progress}
                timer={props.timeRange}
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
    const [markers, setMarkers] = useState([]);

    const [inventory, setInventory] = useState({
        gnoxide: {amount: 0, img: gnoxideImg},
        carbonant: {amount: 0, img: carbonantImg},
        dioxidolatry: {amount: 0, img: dioxidolatryImg}
    });

    const [hotItems, setHotItems] = useState({
        gnoxide: {amount: 0, img: gnoxideImg},
        carbonant: {amount: 0, img: carbonantImg},
        dioxidolatry: {amount: 0, img: dioxidolatryImg}
    });

    const [recentItem, setRecentItem] = useState(null);

    const [timer, setTimer] = useState(null);
    const [recentTimer, setRecentTimer] = useState(null);

    const [blueCount, setBlueCount] = useState(0);
    const [blackCount, setBlackCount] = useState(0);
    const [greenCount, setGreenCount] = useState(0);

    const [bluePercent, setBluePercent] = useState(0);
    const [blackPercent, setBlackPercent] = useState(0);
    const [greenPercent, setGreenPercent] = useState(0);


    const [multiplier, setMultiplier] = useState(1);
    const [gnoxideActive, setGnoxideActive] = useState(false);
    const [carbonantActive, setCarbonantActive] = useState(false);
    const [dioxidolatryActive, setDioxidolatryActive] = useState(false);

    const [currentPlanet, setCurrentPlanet] = useState(0);

    const [timeRange, setTimeRange] = useState(2000);

    //Start placing markers.
    const startGame = () => {
        const startBtn = document.getElementById('startbtnbox');
        startBtn.classList.toggle('shown');

        addMarkers();
    }

    //Add a new marker to the planet.
    const addMarkers = () => {

        clearTimeout(timer);

        //Clear all previous markers.
        let tempMarkers = [];

        //Roll for placing a blue marker.
        if (roll(100) === true) {
            tempMarkers = (tempMarkers.concat(blueMarker()));
        }

        //Roll for placing a black marker.
        if (roll(100) === true) {
            tempMarkers = (tempMarkers.concat(blackMarker()));
        }

        //Increase the chances of having an orange marker with carbonant active.
        let orangeOdds = 10;
        if (carbonantActive) orangeOdds = 50;

        //Roll for placing an orange marker.
        if (roll(orangeOdds) === true) {
            tempMarkers = (tempMarkers.concat(orangeMarker()));
        }

        //Place green markers if current planet is 1.
        if (currentPlanet === 1) {
            tempMarkers = (tempMarkers.concat(greenMarkers()));
        }
        

        setMarkers(tempMarkers);

        //Remove all markers and add a new one after a given time.
        setTimer(setTimeout(() => {
            handleMiss();
        }, timeRange));
    }

    //Handle a click that doesn't hit a marker.
    const handleMiss = () => {

        // Prevent miss if shield active.
        if (dioxidolatryActive) {
            setDioxidolatryActive(false);
            return;
        }

        const startBtn = document.getElementById('startbtnbox');
        startBtn.classList.toggle('shown');

        clearTimeout(timer);

        animateMiss();
        setMarkers([]);
        emptyVessel();
        setMultiplier(1);
        setCarbonantActive(false);
        setGnoxideActive(false);
        setDioxidolatryActive(false);
        setTimeRange(2000);
        setCurrentPlanet(0);

        // Animate planet sealing if planet level went down.
        if (currentPlanet > 0) {
            sealPlanet('white');
        }


        //Reset all hot item counts to 0;
        setHotItems({
            gnoxide: {amount: 5, img: gnoxideImg},
            carbonant: {amount: 5, img: carbonantImg},
            dioxidolatry: {amount: 5, img: dioxidolatryImg}
        });
    }

    //On orange marker click, give player all hot items and reset board.
    const handleSuccess = () => {
        console.log('grats!');

        const startBtn = document.getElementById('startbtnbox');
        startBtn.classList.toggle('shown');

        clearTimeout(timer);
        
        animateSuccess();
        setMarkers([]);
        emptyVessel();
        setMultiplier(1);
        setCarbonantActive(false);
        setGnoxideActive(false);
        setDioxidolatryActive(false);
        setTimeRange(2000);


        //Add all hot items to inventory.
        let tempInventory = inventory;

        tempInventory['gnoxide']['amount'] += hotItems['gnoxide']['amount'];
        tempInventory['carbonant']['amount'] += hotItems['carbonant']['amount'];
        tempInventory['dioxidolatry']['amount'] += hotItems['dioxidolatry']['amount'];

        //Animate moving items to the inventory.
        if (hotItems['gnoxide']['amount'] > 0) {
            animateItemGet('gnoxide');
        }

        setTimeout(() => {
            if (hotItems['carbonant']['amount'] > 0) {
                animateItemGet('carbonant');
            }
        }, 1000);

        //Reset all hot item counts to 0;
        setHotItems({
            gnoxide: {amount: 0, img: gnoxideImg},
            carbonant: {amount: 0, img: carbonantImg},
            dioxidolatry: {amount: 0, img: dioxidolatryImg}
        });
    }

    useEffect(() => {
        const mult = document.getElementById('multiplier');
        mult.classList.remove('bounce');
        void mult.offsetWidth;
        mult.classList.add('bounce');
    }, [multiplier]);

    //Get dimensions and color for creating a blue marker.
    const blueMarker = () => {
        const [top, left] = randomPosition(25);

        let size = '50px';
        if (gnoxideActive) size = '75px';

        return {
            top: top,
            left: left,
            width: size,
            height: size,
            color: 'blue'
        }
    }

    //Get dimensions and color for creating a red marker.
    const blackMarker = () => {
        const [top, left] = randomPosition(15);

        let size = '30px';
        if (gnoxideActive) size = '45px';

        return {
            top: top,
            left: left,
            width: size,
            height: size,
            color: 'black'
        }
    }

    //Get dimensions and color for craeting an orange marker.
    const orangeMarker = () => {
        const [top, left] = randomPosition(15);

        return {
            top: top,
            left: left,
            width: '30px',
            height: '30px',
            color: 'orange'
        }
    }

    //Get dimensions and color for craeting an orange marker.
    const greenMarkers = () => {
        const [top, left] = randomPosition(50);

        let size = '40px';
        if (gnoxideActive) size = '60px';

        // Roll for placement of the second green marker.
        let top2;
        if (roll(50)) {
            top2 = 30;
        } else {
            top2 = -30;
        }

        return [{
            top: top,
            left: left,
            width: size,
            height: size,
            color: 'darkolivegreen',
            number: 1
        }, {
            top: top + top2,
            left: left + 30,
            width: size,
            height: size,
            color: 'darkolivegreen',
            number: 2
        }];
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

    // Mine a marker, adding it to the vessel and showing the animation.
    // Then, roll for random extra rewards.
    const mine = (e, color) => {
        animateMining(e);
        addToVessel(color);

        //Don't roll for a chest if node is orange.

        if (color === 'orange') return;

        // Roll to instantly get coins
        if (roll(10)) {
            let amount = Math.round(Math.random() * 20);
            props.updateCoins(amount)
            animateSmallChest(coinImg);

        //If not coins, roll to give the player an item.
        } else if (roll(10)) {

            // Choose a random possible inventory item.
            let index = Math.floor(Math.random() * Object.keys(inventory).length);
            let choice = Object.keys(inventory)[index];

            console.log(choice);
            animateSmallChest(inventory[choice]['img']);

            // Add the random item to the player's hot items.
            let tempInv = hotItems;
            tempInv[choice]['amount'] += 1;
            setHotItems(tempInv);
        }
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

    //Add a given color to the vessel and process it accordingly.
    const addToVessel = (color) => {
        let tempBlueCount = blueCount;
        let tempBlackCount = blackCount;
        let tempGreenCount = greenCount

        //Add the passed color to the related color count.
        if (color === 'blue') {
            tempBlueCount++;
        } else if (color === 'black') {
            tempBlackCount++;

        //End the current run and give player all hot items.
        } else if (color === 'orange') {
            tempBlueCount = 0;
            tempBlackCount = 0;
            handleSuccess();
        } else if (color === 'darkolivegreen') {
            tempGreenCount++;
        }

        let total = tempBlackCount + tempBlueCount + tempGreenCount;

        //Update fluid level displayed in vessel;
        const root = document.documentElement;
        root.style.setProperty('--fluid-height', `${(total * 5) + 30}%`);

        //Update color count states.
        setBlueCount(tempBlueCount);
        setBlackCount(tempBlackCount);
        setGreenCount(tempGreenCount);


        //Update color percentages.
        setBluePercent(Math.round(tempBlueCount/total * 100));
        setBlackPercent(Math.round(tempBlackCount/total * 100));
        setGreenPercent(Math.round(tempGreenCount/total * 100));

        //Update displayed vessel colors;
        root.style.setProperty('--blue-grow', tempBlueCount);
        root.style.setProperty('--black-grow', tempBlackCount);
        root.style.setProperty('--green-grow', tempGreenCount);


        //Take in color percentages and craft according recipes.
        processColorRatio(tempBlueCount, tempBlackCount, tempGreenCount);
    }    

    //Reset counts for all elements in the vessel.
    const emptyVessel = () => {

        setBlueCount(0);
        setBlackCount(0);
        setGreenCount(0);

        setBluePercent(0);
        setBlackPercent(0);
        setGreenPercent(0);

        //Update displayed vessel colors;
        const root = document.documentElement;
        root.style.setProperty('--blue-grow', 0);
        root.style.setProperty('--black-grow', 0);
        root.style.setProperty('--green-grow', 0);
    }

    //Check the vessel to see if anything has been crafted.
    const processColorRatio = (blue, black, green) => {
        let tempInv = hotItems;

        //Add one gnoxide to inventory.
        if (blue === black && blue >= 4) {
            tempInv.gnoxide.amount += 1 * multiplier;
            setHotItems(tempInv);
            animateItemGet('gnoxide');

            emptyVessel();
            setMultiplier(multiplier + 1);
            setTimeRange(timeRange - 50);

        //Add one carbonant to inventory.
        } else if (black >= 6 && blue === 0) {
            tempInv.carbonant.amount += 1 * multiplier;
            setHotItems(tempInv);
            animateItemGet('carbonant');

            emptyVessel();
            setMultiplier(multiplier + 1);
            setTimeRange(timeRange - 50);

        // Add one dioxidolatry to inventory.
        } else if (green >= 4 && blue === 1) {
            tempInv.dioxidolatry.amount += 1 * multiplier;
            setHotItems(tempInv);
            animateItemGet('dioxidolatry');

            emptyVessel();
            setMultiplier(multiplier + 1);
            setTimeRange(timeRange - 50);
        }
    }

    //Check to see if the player can craft anything with their hot items.
    useEffect(() => {

        //If gnoxide and carbonant are over a threshold, nuke the
        //planet, give the player coins, and move to the next planet.
        if (hotItems['gnoxide']['amount'] >= 5 && 
            hotItems['carbonant']['amount'] >= 6) {

                props.updateCoins(200);
                animateSmallChest(coinImg);
                handleSuccess();
                setCurrentPlanet(1);

                crackPlanet('white');
        }

        // If dioxidolatry is at least 100 and player is on the second
        // planet, destroy the planet and give the player a chest.
        if (hotItems['dioxidolatry']['amount'] >= 100 &&
            currentPlanet === 1) {
            alert('planet destroyed! chest get!')
        }
    }, [hotItems.carbonant.amount, hotItems.gnoxide.amount, hotItems.dioxidolatry.amount]);

    //Use an item if available.
    const consumeItem = (item) => {

        //Prevent using an item when the player has none.
        if (inventory[item]['amount'] < 1) {
            console.log("you've got none of this to use")
            return;
        }

        let tempInv = inventory;
        inventory[item]['amount'] -= 1;
        setInventory(tempInv);

        
        if (item === 'gnoxide' && !gnoxideActive) {
            setGnoxideActive(true);
            setTimeRange(1200);
        }

        if (item === 'carbonant' && !carbonantActive) {
            setCarbonantActive(true);
        }

        if (item === 'dioxidolatry' && !dioxidolatryActive) {
            setDioxidolatryActive(true);
        }

    }

    const animateItemGet = (item) => {
        clearTimeout(recentTimer);

        setRecentItem(inventory[item].img);

        const recent = document.getElementById('recentitem');
        recent.classList.add('shown');

        const recentImg = recent.querySelector('img');
        recentImg.classList.add('shown');

        setRecentTimer(setTimeout(() => {
            recent.classList.remove('shown');
            recentImg.classList.remove('shown');
        }, 1000));
    }

    return (
        <div id='clicker'>

            <div id='tenshibox'>
                {/* <img id='icon' src={props.icon ? props.icon : placeholder} alt=""></img> */}
                <img id='icon' src={placeholder} alt=""></img>
                <img id='tenshi' src={tenshiGif} alt=""></img>
            </div>

            <div id='vessel'>
                <div id='vesselblue'>
                    <div>{blueCount}</div>
                </div>
                <div id='vesselblack'>
                    <div>{blackCount}</div>
                </div>
                <div id='vesselgreen'>
                    <div>{greenCount}</div>
                </div>
                <div id='vesselglass'>

                </div>

            </div>

            <div id='gamebox'>
                <div id='hotitems'>
                    {Object.keys(hotItems).map((key, index) => {
                        return <div className='hotitem'>
                            {/* <div>{key}</div> */}
                            {hotItems[key].amount > 0 ?
                                <div>
                                    <img src={hotItems[key].img} alt=""></img>
                                    <div className='hotitemcount'>{hotItems[key].amount}</div>
                                </div>
                                : null
                            }
                        </div>
                    })}
                </div>
                <div id='effects'>
                    {gnoxideActive ? <img src={gnoxideImg} alt=""></img> : null}
                    {carbonantActive ? <img src={carbonantImg} alt=""></img> : null}
                    {dioxidolatryActive ? <img src={dioxidolatryImg} alt=""></img> : null}
                </div>

                <div id='chestbox'>
                    <img id='smallchestimg' src="" alt=""></img>
                </div>



                <div id='planet'
                    style={currentPlanet === 1 ? {backgroundColor: '#f4b8c4'} : null}
                    className='cracked'
                    onClick={(e,) => {
                        
                        if (e.target.id === 'planet') {
                            handleMiss();
                        }
                        
                    }}>
                    <div id='planetleft'></div>
                    <div id='planetright'></div>
                    <svg id='crackbox'>
                        <polyline points="30,0 30,500"/>
                    </svg>

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
                                    timeRange={timeRange}
                                    number={item.number}
                                    addMarkers={addMarkers}

                                />
                    })}
                    <div id='multiplier'>
                        x{multiplier}
                    </div>
                    <div id='startbtnbox' className='shown'>
                
                        <button onClick={startGame} id='startbtn'>start</button>
                        {/* <svg>
                            <polyline points="0,0 150,0 150,75 0,75 0,0"/>
                        </svg> */}
                    </div>
                    
                </div>
                <div id='clickerinventory'>
                    {Object.keys(inventory).map((key, index) => {
                        return <div className='clickerinvitem'>
                            <div className='namecountbox'>
                                <div>{key}</div>
                                <div className="invcount">{inventory[key].amount}</div>
                            </div>
                       
                            <img src={inventory[key].img} alt="" onClick={e => toggleUseButton(e)}></img>
                            
                            <div className='usebtn' onClick={() => consumeItem(key)}>
                                <div>use</div>
                                <img src={inventory[key].img} alt=""></img>
                            </div>
                            
                            
                            
                        </div>
                    })}
                </div>
                <div id='clickerrecipes'>
                    <img src={recipe1} alt=""></img>
                </div>
                <div id='recentitem'>
                    <img src={recentItem} alt=""></img>
                </div>


                <button id='navtogglebtn' onClick={toggleNavbar}><div>🔃</div></button>
                <div id='clickernav'>
                    <div onClick={showInventory} id='invbtn' className="clickernavitem">Inventory</div>
                    <div onClick={showRecipes} id='recipebtn' className="clickernavitem">Recipes</div>
                </div>
            </div>
        </div>
    );
}

export default Clicker;