import { useState, useEffect } from "react";
import uniqid from "uniqid";

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
    const updateInfo = (e, info) => {

        // Show or hide the info box base on whether a new ape has
        // been clicked.
        if (info === currentApe) {
            toggleInfo();
        } else {
            showInfo();
        }

        setCurrentApe(info);
    }

    // Toggle visibility on the info box.
    const toggleInfo = () => {
        const info = document.getElementById('nftinfo');
        info.classList.toggle('shown');
    }

    // Toggle visibility on the info box.
    const showInfo = () => {
        const info = document.getElementById('nftinfo');
        info.classList.add('shown');
    }

    //Attempt to buy the targeted NFT.
    const buyNft = (e, info) => {

        //Remove coins from the user equal to the NFT price if they
        //can afford it. Then move the ape from the store to the user.

        if (props.coins >= info.cost) {
            console.log('purchased!');
            props.updateCoins(info.cost * -1);
            props.addApeToAccount(info);
            props.removeApeFromStore(info);
        } else {
            console.log("can't afford!");
        }
    }

    console.log('loaded')

    return (
        <div id='market'>

            <div id='nftcontainer'>
                {props.apes !== [] ? props.apes.map((item, index) => {
                    return <div className='nftitem'  key={uniqid()}>
                        <img 
                            src={item['img']} 
                            alt=""
                            onClick={e => {
                                updateInfo(e, item)
                                e.target.parentElement.classList.add('selected');
                            }}
                        ></img>
                    </div>
                }) :  null}
            </div>

            {currentApe === null ?  <div id='nftinfo'></div> :

                <div id='nftinfo' onClick={toggleInfo}>
                    <div>{currentApe.sellerName === undefined ? null : `seller: ${currentApe.sellerName}`}</div>

                    <div>{currentApe.price} coins</div>

                    {currentApe.attributes.map((item) => {
                        return <div key={uniqid()}>
                            {item['trait_type']}:{item['value']}
                        </div>
                    })}

                    <button className='buybtn' onClick={e => buyNft(e, currentApe)}>Buy</button>

                </div>


            }



        </div>
    )
}

export default Market;