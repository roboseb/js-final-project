import { useState, useEffect } from "react";
import uniqid from "uniqid";

const Market = () => {
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
                console.log(response);

                const nfts = response['nfts']

                let i = 1

                setApes(nfts);
                setImg(nfts[0]['media'][0]['gateway']);

                console.log(nfts[0]);
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
        //console.log(e, data);

        const box = e.target.parentElement;
        const info = box.querySelector('.nftinfo');

        console.log(info);

        info.classList.toggle('shown');
    }


    return (
        <div id='market'>

            <div id='nftcontainer'>
                {apes.map((item, index) => {
                    return <div className='nftitem' onClick={e => toggleInfo(e, item)}>
                        <img 
                            src={item['media'][0]['gateway']} 
                            alt=""
                            key={uniqid()}
                        ></img>

                        <div className='nftinfo'>
                            {item.metadata.attributes.map((item) => {
                                return <div key={uniqid()}>{item['trait_type']}:{item['value']}</div>
                            })}
                          
                        </div>
                    </div>
                })}
            </div>


        </div>
    )
}

export default Market;