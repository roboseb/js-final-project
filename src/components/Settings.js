const Settings = (props) => {
    return (
        <div id='settings'>
            <h3>Settings</h3>
            <div id='accountinfo'>
                <div>account info</div>


                <div>{props.info !== null ? props.info.email : 'poopy'}</div>
                <img src={props.info !== null ? props.info.photoURL : null} alt=""></img>

                <button onClick={props.getInfo}>Get Info</button>
                <button onClick={props.signIn}>Sign In</button>
                <button onClick={props.updateCoins}>Add Cash</button>
                <button onClick={props.loadData}>Load Data</button>
            </div>
        </div>
    )
}

export default Settings;