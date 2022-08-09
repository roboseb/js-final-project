import placeholder from "../../src/art/placeholder.png";

const Header = (props) => {
    return (
        <div id='header'>

            <h1>Nube</h1>
            <div id='coins'>{props.coins} coins</div>
            <img src={props.info !== null ? props.info.photoURL : placeholder} alt=""></img>

        </div>
    );
}

export default Header;