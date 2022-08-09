import uniqid from "uniqid";
import React from "react";
import { memo } from "react";


const NftContainer = (props) => {

    //Remove the selected class from the previously selected item.
    const clearSelected = (e) => {
        const container = document.getElementById('nftcontainer');
        const selected = container.querySelector('.selected');

        if (selected !== null && e.target.parentElement !== selected) {
            selected.classList.remove('selected');
        }
    }

    return (
        <div id='nftcontainer'>
            {props.apes !== [] ? props.apes.map((item, index) => {
                return <div className='nftitem' key={uniqid()}>
                    <img
                        className='nftplaceholder'
                        src={item['img']}
                        alt=""
                    ></img>
                    <img
                        className='nftimg'
                        src={item['img']}
                        alt=""
                        onClick={e => {
                            clearSelected(e);
                            e.target.parentElement.classList.toggle('selected');
                            props.updateInfo(e, item, index);
                        }}
                    ></img>

                </div>
            }) : null}
        </div>
    );
}

export default memo(NftContainer);