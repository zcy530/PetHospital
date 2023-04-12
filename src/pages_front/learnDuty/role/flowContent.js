import React from 'react'
import './flowContent.css'
import imgUrl2 from "./04364f825091a4776732db4f7230c428.jpg";

function flowContent({name, imgUrl, content}) {
    return (
        <div className='flowContent'>
            <div className='flowName'>
                <h1>{name}</h1>
            </div>
            <div className='flowPic'>
                <img src={imgUrl} alt=''/>
            </div>
            <div className='opeContent'>
                {content}
            </div>
        </div>
    )
}

export default flowContent
