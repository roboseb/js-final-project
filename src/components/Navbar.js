import React from "react";
import {Link} from "react-router-dom";
import { memo } from "react";

import settingsImg from "../art/settings.svg";
import smileImg from "../art/smile.svg";
import cartImg from "../art/shopping-cart.svg";
import briefcaseImg from "../art/briefcase.svg";

// Highligh a particular tab.
const setCurrentTab = (id) => {

    // Clear the selected class from all tabs.
    const tabs = Array.from(document.getElementById('navbar').children);
    tabs.forEach(tab => {
        tab.firstChild.classList.remove('selected');
    });

    const tab = document.getElementById(id);
    tab.classList.add('selected');
}

const Navbar = () => {
    return (
        <div id='navbar'>
            
            <Link onClick={() => setCurrentTab('navassets')} className='navitem' to='/' style={{ textDecoration: 'none' }}>
                <div id='navassets' className='selected'>
                    <img src={briefcaseImg} alt=""></img>
                </div>
            </Link>
            <Link onClick={() => setCurrentTab('navmarket')} className='navitem selected' to='/market' style={{ textDecoration: 'none' }}>
                <div id='navmarket'>
                    <img src={cartImg} alt=""></img>
                </div>
            </Link>

            <Link onClick={() => setCurrentTab('navgames')} className='navitem' to='/games' style={{ textDecoration: 'none' }}>
                <div id='navgames'>
                    <img src={smileImg} alt=""></img>
                </div>
            </Link>

            <Link onClick={() => setCurrentTab('navsettings')} className='navitem' to='/settings' style={{ textDecoration: 'none' }}>
                <div id='navsettings'>
                    <img src={settingsImg} alt=""></img>
                </div>
            </Link>
        </div>
    )
}

export default memo(Navbar);