import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Assets from "./components/Assets";
import Market from "./components/Market";
import Header from "./components/Header";
import Settings from "./components/Settings";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, getDocs, addDoc, setDoc, updateDoc, doc } from 'firebase/firestore';
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

    //Load user info once the data has been updated.
    onAuthStateChanged(auth, (user) => {
        //console.log(userInfo);

        if (user && userInfo === null) {
            //console.log('signed in')

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
            console.log(uid);

            await setDoc(doc(db, 'users', uid), {
                email: userInfo.email,
                coins: coins
            });
        }

        if (userInfo !== null) {
            updateCash();
        }
    }, [coins])

    //Load a user's data if signed in.
    async function loadData() {
        //Break out of function if not signed in.
        if (userInfo === null) return;


        const docRef = doc(db, "users", userInfo.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setCoins(docSnap.data().coins);

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

    return (
        <BrowserRouter>
            <div id="app">

                <Header 
                    info={userInfo}
                    coins={coins}
                />

                <Routes>
                    <Route path='/' element={<Assets />} />
                    <Route path='/market' element={<Market 
                        updateCoins={updateCoins}
                        coins={coins}
                    />} />
                    <Route path='/settings' element={<Settings 
                        info={userInfo}
                        getInfo={getInfo}
                        signIn={signIn}
                        loadData={loadData}
                        updateCoins={() => updateCoins(100)}  
                    />} />
                </Routes>

                <Navbar />
            </div>
        </BrowserRouter>

  );
}

export default App;
