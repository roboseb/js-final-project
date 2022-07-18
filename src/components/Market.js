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
                setImg(nfts[0]['media'][0]['gateway']);
            })
            .catch(error => console.log('error', error))
    }

    const [apes, setApes] = useState([]);
    const [img, setImg] = useState('https://lh3.googleusercontent.com/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs=h600');

    //Fetch NFTs on component load.
    useEffect(() => {
        fetchNfts();
    }, []);

    const toggleInfo = (e, data) => {
        console.log(e.target, data);

        const box = e.target.parentElement;
        const info = box.querySelector('.nftinfo');

        //console.log(info);

        info.classList.toggle('shown');
    }

    //Attempt to buy the targeted NFT.
    const buyNft = (e, info) => {
        console.log(info);

        //Remove coins from the user equal to the NFT price if they
        //can afford it.

        if (props.coins >= info.price) {
            console.log('purchased!')
            props.updateCoins(info.price * -1);
        } else {
            console.log("can't afford!")
        }
        

    }


    return (
        <div id='market'>

            <div id='nftcontainer'>
                {apes.map((item, index) => {
                    return <div className='nftitem'  key={uniqid()}>
                        <img 
                            src={item['media'][0]['gateway']} 
                            alt=""
                            onClick={e => toggleInfo(e, item)}
                        ></img>

                        <div className='nftinfo'>
                            {item.metadata.attributes.map((item) => {
                                return <div key={uniqid()}>{item['trait_type']}:{item['value']}</div>
                            })}
                            <div>{item.price} coins</div>
                            <button onClick={e => buyNft(e, item)}>Buy</button>

                          
                        </div>
                    </div>
                })}
            </div>


        </div>
    )
}

export default Market;