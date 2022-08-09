import { useState, useEffect, useCallback } from "react";
import uniqid from "uniqid";

import NftContainer from "./NftContainer";

const Market = (props) => {
    const fetchNfts = () => {
        console.log('fetching');

        // Contract address
        const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'

        // Metadata inclusion flag
        const withMetadata = 'true';

        // Alchemy API key
        const apiKey = 'FdZPu5qAcfhzEWeax5dzbzxio59WfOhW';

        // Alchemy URL
        const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getNFTsForCollection`;
        const url = `${baseURL}?contractAddress=${address}&withMetadata=${withMetadata}`;

        var requestOptions = {
            method: 'get',
            redirect: 'follow'
        };



        async function getNfts() {
            let response = await fetch(url, requestOptions);
            let nfts = await response.json();

            return nfts;
        }

        getNfts()
            .then(response => {
                //console.log(response);

                const nfts = response['nfts']

                nfts.forEach((item) => {
                    item.price = 1000;
                })

                setApes(nfts);
                //props.saveApes(nfts);
            })
            .catch(error => console.log('error', error))
    }

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
        const market = document.getElementById('market');

        market.scrollTo({top: element.offsetTop - 20, behavior: 'smooth'});
    }

    // Toggle visibility on the info box.
    const toggleInfo = (e) => {

        // Prevent toggling info box on button or input click.
        if (e.target.classList.contains('buybtn')) return;

        const infoBox = document.getElementById('nftinfo');

        if (e.target.parentElement.classList.contains('selected')) {
            infoBox.classList.add('shown');
        } else {
            infoBox.classList.remove('shown');
        }
        
    }


    //Attempt to buy the targeted NFT.
    const buyNft = (e, info) => {
        // Prevent a user from purchasing their own ape.
        if (props.userInfo.uid === info.seller) {
            props.playMessage("That's your ape!");
            return;
        }


        //Remove coins from the user equal to the NFT price if they
        //can afford it. Then move the ape from the store to the user.

        if (props.coins >= info.cost) {
            console.log('purchased!');
            props.updateCoins(info.cost * -1);
            props.addApeToAccount(info);
            props.removeApeFromStore(info);

            props.playMessage('Ape purchased!');
        } else {
            props.playMessage("Can't afford!")
        }
    }


    return (
        <div id='market'>
            <NftContainer
                updateInfo={updateInfo}
                apes={props.apes}
            />

            

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
                        <div>{currentApe.sellerName === undefined ? 'seller: market' : `seller: ${currentApe.sellerName}`}</div>

                        <div>{currentApe.cost} coins</div>
                        <button className='buybtn' onClick={e => buyNft(e, currentApe)}>Buy</button>
                    </div>

                </div>
            }




        </div>
    )
}

export default Market;