import placeholder from "../art/placeholder.png";

const Settings = (props) => {

    return (
        <div id='settings'>
            <h3>Settings</h3>
            <div id='accountinfo'>
                <div>account info</div>


                <div>{props.info !== null ? props.info.email : 'Sign in to collect coins and funge NFTs!'}</div>
                <img src={props.info !== null ? props.info.photoURL : placeholder} alt=""></img>

                <button onClick={props.signIn}>Sign In</button>
                <button onClick={props.signUserOut}>Sign Out</button>

                {props.info !== null && props.info.uid === "4lbo0z1wuOhIpSC0zWoyekKVESH3" ?
                    <button onClick={props.updateCoins}>Add Cash</button>
                :
                    null
                }
                
                {/* <button onClick={props.loadData}>Load Data</button> */}
            </div>
        </div>
    )
}

export default Settings;