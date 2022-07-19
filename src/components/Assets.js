import uniqid from "uniqid";

const Assets = (props) => {

    const toggleInfo = (e, data) => {

        const box = e.target.parentElement;
        const info = box.querySelector('.nftinfo');

        info.classList.toggle('shown');

        console.log(data);

    }


    return (
        <div id='assets'>
            <div id='userapes'>
                {props.userApes !== [] ? props.userApes.map((item, index) => {
                    return <div className='nftitem' key={uniqid()}>
                        <img
                            src={item['img']}
                            alt=""
                            onClick={e => toggleInfo(e, item)}
                        ></img>

                        <div className='nftinfo'>
                            {item.attributes.map((item) => {
                                return <div key={uniqid()}>{item['trait_type']}:{item['value']}</div>
                            })}
                            <div>{item.price} coins</div>
                            {!item.listed ? <button onClick={() => props.putApeOnMarket(item)}>List</button>
                                : <button>Unlist</button>   
                            }
                            


                        </div>
                    </div>
                }) : null}
            </div>
        </div>
    )
}


export default Assets;