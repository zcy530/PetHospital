import React, {useEffect, useState} from 'react'
import './singleFlow.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button } from '@mui/material';
import FlowContent from './flowContent.js'

function SingleFlow({flowName, flowsArr}) {
    var items = [], arrLength = flowsArr.length, name = "穿戴手术设备", imgUrl = "./04364f825091a4776732db4f7230c428.jpg", content = "如何穿戴手术设备？";
    const [count, setCount] = useState(1);
    const [opeState, setOpeState] = useState([]);
    for(var i = 0; i < flowsArr.length; i++) opeState.push(false);
    useEffect(() => {
        console.log(arrLength);
        console.log(flowsArr);
        console.log(count);
    })
    function changeState() {
        setCount((count + 1) % (arrLength + 1));
        var newOpeState = [];
        for(let i = 0; i < arrLength; i++)
            if(i < count) newOpeState.push(true);
            else newOpeState.push(false);
        setOpeState(newOpeState);
        console.log(opeState);
    }
    for(let i = 0; i < flowsArr.length - 1; i++){
        items.push(
        <span className='flow-icon'>
            {opeState[i] ? (<CheckCircleIcon color='success'/>) : (<CheckCircleIcon/>)}
            <div>{flowsArr[i]}</div>
        </span>);
        items.push(<span className='flow-icon'>
            <RemoveIcon />
        </span>)
        items.push(<span className='flow-icon'>
            <RemoveIcon />
        </span>)
        items.push(<span className='flow-icon'>
            <RemoveIcon />
        </span>)
    }
    items.push(
        <span className='flow-icon'>
            {opeState[flowsArr.length - 1] ? (<CheckCircleIcon color='success'/>) : (<CheckCircleIcon />)}
        <div>{flowsArr[flowsArr.length - 1]}</div>
    </span>
    );
    return (
        <div className='singleFlow'>
            <h3>{flowName}</h3>
            <div className='flow-items'>{items}</div>
            <div className='flow-button'>
                <Button variant="outlined" onClick={() => changeState()}>Next Step</Button>
            </div>
            <FlowContent name = {name} imgUrl = {imgUrl} content = {content}/>
        </div>
    )
}

export default SingleFlow
