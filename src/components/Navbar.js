import React from "react";
import {Link} from "react-router-dom";




const Navbar = () => {
    return (
        <div id='navbar'>
            
            <Link className='navitem' to='/' style={{ textDecoration: 'none' }}>
                <div id='navassets'>Assets</div>
            </Link>
            <Link className='navitem' to='/market' style={{ textDecoration: 'none' }}>
                <div id='navmarket'>Market</div>
            </Link>

            <Link className='navitem' to='/games' style={{ textDecoration: 'none' }}>
                <div id='navgames'>Games</div>
            </Link>

            <Link className='navitem' to='/settings' style={{ textDecoration: 'none' }}>
                <div id='navsettings'>Settings</div>
            </Link>
        </div>
    )
}

export default Navbar;