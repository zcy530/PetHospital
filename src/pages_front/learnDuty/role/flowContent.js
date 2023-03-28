import React from 'react'
import './flowContent.css'

function flowContent({name, imgUrl, content}) {
    return (
        <div className='flowContent'>
            <div className='flowName'>
                <h1>{name}</h1>
            </div>
            <div className='flowPic'>
                <img url={imgUrl} alt=''/>
            </div>
            <div className='opeContent'>
                {content}
            </div>
        </div>
    )
}

export default flowContent
