import { useState, useEffect, useCallback } from "react";
import uniqid from "uniqid";

import NftContainer from "./NftContainer";

const Assets = (props) => {

    const [apes, setApes] = useState([]);

    const [currentApe, setCurrentApe] = useState(null);

    //Fetch NFTs on component load.
    useEffect(() => {
        //fetchNfts();
    }, []);

    // Update the details in the info box, and show or hide it.
    const updateInfo = useCallback((e, info, index) => {
        //Bring the clicked NFT into view.
        scrollToElement(e);

        //Update the shown NFT details, and toggle the info box.
        toggleInfo(e);
        setCurrentApe(info);
    }, []);

    //Scroll the market page to bring the selected NFT into focus.
    const scrollToElement = (e) => {
        const element = e.target.parentElement;
        const assets = document.getElementById('assets');

        assets.scrollTo({top: element.offsetTop - 20, behavior: 'smooth'});
    }

    // Toggle visibility on the info box.
    const toggleInfo = (e) => {

        // Prevent toggling info box on button or input click.
        if (e.target.id === 'listbtn' || 
            e.target.id === 'priceinput') return;

        const infoBox = document.getElementById('nftinfo');

        if (e.target.parentElement.classList.contains('selected')) {
            infoBox.classList.add('shown');
        } else {
            infoBox.classList.remove('shown');
        }
        
    }

    return (
        <div id='assets'>
            {props.userInfo === null ? <div id='nouserassets'>Sign in to see your apes here!</div> :
            <NftContainer
                id='userapes'
                updateInfo={updateInfo}
                apes={props.userApes}
            />}

            {currentApe === null ?  <div id='nftinfo'></div> :
                <div id='nftinfo' onClick={toggleInfo}>

                    <div className='nftattributes'>
                        {currentApe.attributes.map((item) => {
                            return <div key={uniqid()}>
                                {item['trait_type']}:{item['value']}
                            </div>
                        })}
                    </div>

                    <div className='purchaseinfo'>
                        <div>{currentApe.listed ? 'Listed' : 'Unlisted'}</div>

                        <div id='pricebox'>
                            <input id='priceinput' type='number' placeholder={currentApe.cost}></input>
                            <div>coins</div>
                        </div>


                        {!currentApe.listed ? 
                            <button id='listbtn' onClick={() => props.putApeOnMarket(currentApe, document.getElementById('priceinput').value)}>List</button>
                            : <button id='listbtn' onClick={() => props.unlistApe(currentApe)}>Unlist</button>   
                        }
                        
                    </div>

                </div>
            }

        </div>
    )
}

export default Assets;