import React from 'react';
import './infoBar.css';

function infoBar({Component, info}) {
  return (
    <div className='infoBar'>
        <span className = "comp">
            <Component />
        </span>
        <span className='info'>{info}</span>
    </div>
  )
}

export default infoBar
