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
import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, onAuthStateChanged} from "firebase/auth";
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

    //Load user info once the data has been updated.
    onAuthStateChanged(auth, (user) => {
        //console.log(userInfo);

        if (user && userInfo === null) {
            //console.log('signed in')

            const userData = getAuth().currentUser; 

            console.log(userData);

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
            //console.log("Document data:", docSnap.data());
            setCoins(docSnap.data().coins);
            setUserApes(docSnap.data().apes);

            console.log("user's apes:" + docSnap.data().apes);

        } else {

            console.log("No such document!");
        }

    }


    //Redirect the user to a google sign in page.
    async function signIn() {
        const auth = getAuth();
        signInWithRedirect(auth, provider);
    }

    const getInfo = () => {
        //console.log(userInfo);

        const auth = getAuth();

        setUserInfo(auth.currentUser);

        //console.log(auth);
    }

    //Take NFT api data and save relevant info to firestore.
    const saveApes = (apes) => {
        //console.log(apes[0]);

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
            console.log('saving' + ape.id);

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

        console.log('ape purchased!');
    }

    //Remove an ape from the firestore db market.
    async function removeApeFromStore(ape) {
        //Prevent attempting to add an ape without an account.
        if (userInfo === null) return;

        await deleteDoc(doc(db, "apes", ape.id));

        console.log('ape deleted!');
        
        //Remove ape from locally displayed ape market.
        let tempApes = apes;

        const index = tempApes.indexOf(ape);
        if (index > -1) {
            tempApes.splice(index, 1);
        }

        setApes(tempApes.concat());
    }

    //List ape on market.
    async function putApeOnMarket(ape) {
        //Prevent attempting to add an ape without an account.
        if (userInfo === null) return;

        //Update firestore db with ape listing.
        const uid = userInfo.uid;
        await setDoc(doc(db, 'apes', ape.id), {
            attributes: ape.attributes,
            img: ape.img,
            cost: ape.cost,
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

        tempApes.unshift(tempApe);
        setApes(tempApes);

        //Update local user's apes to reflect listing.
        let tempUserApes = userApes;
        const index = tempUserApes.indexOf(ape);
        tempUserApes[index] = tempApe;

        console.log(index, tempApe);

        setUserApes(tempUserApes);

        //Update user's ape in firestore to reflect listing.
        const docRef = doc(db, "users", uid);
        
        await updateDoc(docRef, {
          apes: tempUserApes
        });

        console.log('ape listed!');

    } 

    return (
        <BrowserRouter>
            <div id="app">

                <Header 
                    info={userInfo}
                    coins={coins}
                />

                <Routes>
                    <Route path='/' element={<Assets 
                        userApes={userApes}
                        putApeOnMarket={putApeOnMarket}
                    />} />
                    <Route path='/market' element={<Market 
                        updateCoins={updateCoins}
                        coins={coins}
                        saveApes={saveApes}
                        apes={apes}
                        addApeToAccount={addApeToAccount}
                        removeApeFromStore={removeApeFromStore}
                    />} />
                    <Route path='/settings' element={<Settings 
                        info={userInfo}
                        getInfo={getInfo}
                        signIn={signIn}
                        loadData={loadData}
                        updateCoins={() => updateCoins(100)}  
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
