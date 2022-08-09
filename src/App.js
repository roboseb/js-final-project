import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Assets from "./components/Assets";
import Market from "./components/Market";
import Header from "./components/Header";
import Settings from "./components/Settings";
import Games from "./components/Games";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, getDocs, addDoc, deleteDoc, setDoc, updateDoc, doc } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, signOut, signInWithRedirect, getRedirectResult, onAuthStateChanged} from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjZEB7OQfS8_EZKtax4rwF8y31ycEnchk",
  authDomain: "nube-a0914.firebaseapp.com",
  projectId: "nube-a0914",
  storageBucket: "nube-a0914.appspot.com",
  messagingSenderId: "606637075789",
  appId: "1:606637075789:web:88553ec1ae662d4f525b04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

const auth = getAuth();

function App() {

    const [userInfo, setUserInfo] = useState(null);
    const [coins, setCoins] = useState(0);
    const [apes, setApes] = useState([]);
    const [userApes, setUserApes] = useState([]);

    const [message, setMessage] = useState('Hi, this is a test dfsd f');

    //Load user info once the data has been updated.
    onAuthStateChanged(auth, (user) => {

        if (user && userInfo === null) {

            const userData = getAuth().currentUser; 

            //Update session's user info and load their data.
            setUserInfo(userData);
        }
    });

    //Load user data once signed in succesfully.
    useEffect(() => {
        loadData();
    }, [userInfo]);

    //Add cash to player account.
    async function updateCoins(amount)  {
        
        setCoins(coins => coins + amount);
    }

    //Update firebase db on coin change.
    useEffect(() => {

        //Save current coin count to the firestore db.
        async function updateCash() {
            const uid = userInfo.uid;


            const docRef = doc(db, "users", uid);

            // Set the "capital" field of the city 'DC'
            await updateDoc(docRef, {
              coins: coins
            });
        }

        if (userInfo !== null) {
            updateCash();
        }
    }, [coins]);

    //Load a user's data if signed in.
    async function loadData() {
        //Break out of function if not signed in.
        if (userInfo === null) return;


        const docRef = doc(db, "users", userInfo.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setCoins(docSnap.data().coins);
            setUserApes(docSnap.data().apes);
        } else {

            console.log("No such document!");
        }

    }


    //Redirect the user to a google sign in page.
    async function signIn() {
        const auth = getAuth();
        signInWithRedirect(auth, provider);
    }

    // Sign out the user.
    async function signUserOut() {
        
        const auth = getAuth();

        signOut(auth).then(() => {
            setUserInfo(null);
            playMessage('Sign out successful!');
        }).catch((error) => {

            console.log(error);
        });
    }

    //Take NFT api data and save relevant info to firestore.
    const saveApes = (apes) => {

        let newApes = [];

        //Make new ape array from API data using only needed info.
        apes.forEach((item) => {
            let newApe = {};

            newApe.attributes = item.metadata.attributes;
            newApe.img = item['media'][0]['gateway'];
            newApe.cost = 1000;
            newApe.id = item['media'][0]['raw'].slice(7);

            newApes.push(newApe);
        });

        //Store each ape in the firestore db.
        newApes.forEach(async function (ape) {

            await setDoc(doc(db, 'apes', ape.id), {
                attributes: ape.attributes,
                img: ape.img,
                cost: ape.cost,
                id: ape.id
            });
        });
    }

    async function fetchApes() {
        console.log('fetching from db');

        let tempApes = [];

        const querySnapshot = await getDocs(collection(db, "apes"));
        querySnapshot.forEach((doc, index) => {

            tempApes.push(doc.data());
            setApes(tempApes);
        });


    }

    //Fetch ape data from firestore db on load.
    useEffect(() => {
        fetchApes();
    }, []);

    //Add a purchased ape to signed in user's account.
    async function addApeToAccount(ape) {
        //Prevent attempting to add an ape without an account.
        if (userInfo === null) return;

        const uid = userInfo.uid;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        let tempApes = userApes;
        tempApes.push(ape);

        setUserApes(tempApes);

        //Update firestore db with user's apes.
        await updateDoc(docRef, {
          apes: tempApes
        });
    }

    //Remove an ape from the firestore db market.
    async function removeApeFromStore(ape) {
        //Prevent attempting to add an ape without an account.
        if (userInfo === null) return;

        await deleteDoc(doc(db, "apes", ape.id));
        
        //Remove ape from locally displayed ape market.
        let tempApes = apes;

        const index = tempApes.indexOf(ape);
        if (index > -1) {
            tempApes.splice(index, 1);
        }

        setApes(tempApes.concat());
    }

    // Unlist an ape from the market.
    async function unlistApe(ape) {
        
        //Prevent attempting to add an ape without an account.
        if (userInfo === null) return;

        // Remove the listing from the store.
        removeApeFromStore(ape);

        const uid = userInfo.uid;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        let tempApes = userApes;
        const index = tempApes.indexOf(ape);

        // Set the chosen ape to unlisted.
        tempApes[index].listed = false;

        setUserApes(tempApes);

        //Update firestore db with user's apes.
        await updateDoc(docRef, {
            apes: tempApes
        });

        playMessage('Ape unlisted!');
    }

    //List ape on market.
    async function putApeOnMarket(ape, price) {
        //Prevent attempting to add an ape without an account.
        if (userInfo === null) return;

        //Update firestore db with ape listing.
        const uid = userInfo.uid;
        await setDoc(doc(db, 'apes', ape.id), {
            attributes: ape.attributes,
            img: ape.img,
            cost: parseInt(price),
            id: ape.id,
            seller: uid,
            sellerName: userInfo.displayName,
            listed: true
        });

        //Update local ape array with new ape.
        let tempApes = apes;
        let tempApe = ape;
        tempApe.seller = uid;
        tempApe.sellerName = userInfo.displayName;
        tempApe.listed = true;
        tempApe.cost = parseInt(price);

        tempApes.unshift(tempApe);
        setApes(tempApes);

        //Update local user's apes to reflect listing.
        let tempUserApes = userApes;
        const index = tempUserApes.indexOf(ape);
        tempUserApes[index] = tempApe;

        setUserApes(tempUserApes);

        //Update user's ape in firestore to reflect listing.
        const docRef = doc(db, "users", uid);
        
        await updateDoc(docRef, {
          apes: tempUserApes
        });

        playMessage('Ape listed!');
    }

    // Give the user a passed message, similar to an alert.
    const playMessage = (message) => {
        setMessage(message);

        const msg = document.getElementById('message');
        msg.classList.remove('shown');
        void msg.offsetWidth;
        msg.classList.add('shown');
    }

    return (
        <BrowserRouter>
            <div id="app">
                <div id='message'>
                    {message}
                </div>

                <Header 
                    info={userInfo}
                    coins={coins}
                />

                <Routes>
                    <Route path='/js-final-project' element={<Assets 
                        userApes={userApes}
                        putApeOnMarket={putApeOnMarket}
                        unlistApe={unlistApe}
                        userInfo={userInfo}
                    />} />
                    <Route path='/market' element={<Market 
                        updateCoins={updateCoins}
                        coins={coins}
                        saveApes={saveApes}
                        apes={apes}
                        addApeToAccount={addApeToAccount}
                        removeApeFromStore={removeApeFromStore}
                        playMessage={playMessage}
                        userInfo={userInfo}
                    />} />
                    <Route path='/settings' element={<Settings 
                        info={userInfo}
                        signIn={signIn}
                        signUserOut={signUserOut}
                        loadData={loadData}
                        updateCoins={() => updateCoins(100)}  
                        coins={coins}
                        userApes={userApes}
                    />} />

                    <Route path='/games' element={<Games
                        icon={userInfo === null ? null : userInfo.photoURL}
                        updateCoins={updateCoins}
                    />} />


                </Routes>

                <Navbar />
            </div>
        </BrowserRouter>

  );
}

export default App;
