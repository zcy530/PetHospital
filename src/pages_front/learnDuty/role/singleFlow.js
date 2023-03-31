import React, {useEffect, useState} from 'react'
import './singleFlow.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button } from '@mui/material';
import FlowContent from './flowContent.js'

function SingleFlow({flowName, flowsArr, content}) {
    var items = [], arrLength = flowsArr.length, imgUrl = "./04364f825091a4776732db4f7230c428.jpg";
    const [count, setCount] = useState(1);
    const [opeState, setOpeState] = useState([]);
    useEffect(() => {
        console.log(count);
    }, count);
    for(var i = 0; i < flowsArr.length; i++) opeState.push(false);
    for(let i = 0; i < flowsArr.length - 1; i++){
        let name = flowsArr[i].operationName;
        items.push(
        <span className='flow-icon'>
            {opeState[i] ? (<CheckCircleIcon color='success'/>) : (<CheckCircleIcon/>)}
            <div>{name}</div>
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
        <div>{flowsArr[flowsArr.length - 1].operationName}</div>
        </span>
    );
    function changeState() {
        console.log(count)
        setCount((count + 1) % (arrLength + 1));
        console.log(count)
        var newOpeState = [];
        for(let i = 0; i < arrLength; i++)
            if(i < count) newOpeState.push(true);
            else newOpeState.push(false);
        setOpeState(newOpeState);
        console.log(opeState);
    }
    
    return (
        <div className='singleFlow'>
            <h3>{flowName}</h3>
            <div className='flow-items'>{items}</div>
            <div className='flow-button'>
                <Button variant="outlined" onClick={() => changeState()}>Next Step</Button>
            </div>
            {count !== 1 ? <FlowContent name = {flowName} imgUrl = {flowsArr[(count + 3) % arrLength].url} content = {content}/> : null}
        </div>
    )
}

export default SingleFlow
