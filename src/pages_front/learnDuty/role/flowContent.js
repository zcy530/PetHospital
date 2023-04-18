import React from 'react'
import './flowContent.css'

function flowContent({name, imgUrl, content}) {
    return (
        <div className='flowContent'>
            <div className='flowPic'>
                <img src={imgUrl} alt=''/>
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
