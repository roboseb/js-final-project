import Clicker from "./games/Clicker"

const Games = (props) => {
    return (
        <div id='games'>Games
            <Clicker 
                icon={props.icon}
                updateCoins={props.updateCoins}
            />
        </div>
    );
}

export default Games;