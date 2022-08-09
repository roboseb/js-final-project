import placeholder from "../art/placeholder.png";
import googleLogo from "../art/Google__G__Logo.svg";
import { useState } from "react";

const Settings = (props) => {

    //Generate total net worth on settings page load.
    const getNetWorth = () => {
        if (props.info !== null) {

            let sum = props.userApes.reduce((partialSum, a) => {
                return parseInt(partialSum) + parseInt(a.cost);

            }, 0);

            sum += props.coins;
            return sum;
        }
    }

    return (
        <div id='settings'>

            {props.info !== null ?
                <div id='accountinfo'>

                    <div id='iconemailbox'>
                        <div>
                            <div>signed in as</div>
                            {props.info.email}
                        </div>
                        <img src={props.info.photoURL} alt=""></img>
                    </div>
                    <div id='statsbox'>
                        <h1>{props.info.displayName}'s stats</h1>
                        <div id='statsgrid'>
                            <div>coins</div>
                            <div>{props.coins}</div>

                            <div>apes</div>
                            <div>{props.userApes.length}</div>

                            <div>net worth</div>
                            <div>{getNetWorth()}</div>
                        </div>
                    </div>

                    <button id='signoutbtn' onClick={props.signUserOut}>Sign Out</button>

                    {/* Display an add cash button if roboseb is signed in. */}
                    {props.info !== null && props.info.uid === "4lbo0z1wuOhIpSC0zWoyekKVESH3" ?
                        <button id='cashbtn' onClick={props.updateCoins}>Add Cash</button>
                        :
                        null
                    }


                    {/* <button onClick={props.loadData}>Load Data</button> */}
                </div>
                :
                <div id='signinpanel'>
                    <div>Sign in with your google account to start funging apes!</div>
                    <button onClick={props.signIn}>
                        <img src={googleLogo} alt=""></img>
                        <div>Sign in with Google</div>
                    </button>
                </div>

            }




        </div>
    )
}

export default Settings;