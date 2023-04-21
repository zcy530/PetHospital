import React from 'react'
import './flowContent.css'

function flowContent({name, imgUrl, content}) {
    const imgUrl2 = imgUrl + '?x-oss-process=image/resize,m_lfit,w_800,h_800';
    return (
        <div className='flowContent'>
            <div className='flowPic'>
                <img src={imgUrl2} alt=''/>
            </div>
            <div className = "flowOpe">
                <div className='flowName'>
                    <h2>{name}</h2>
                </div>
                <div className='opeContent'>
                    {content}
                </div>  
            </div>
        </div>
    )
}

export default flowContent
