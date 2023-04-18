import React, {useEffect, useState} from 'react'
import './singleFlow.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button } from '@mui/material';
import FlowContent from './flowContent.js'

function SingleFlow({flowName, flowsArr, flowsLen, content}) {
    var items = [], arrLength = flowsLen;
    const [count, setCount] = useState(1);
    const [opeState, setOpeState] = useState([]);
    useEffect(() => {
        setCount(1);
        setOpeState([]);
    },[flowName]);
    for(var i = 0; i < arrLength; i++) opeState.push(false);
    for(let i = 0; i < arrLength - 1; i++){
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
            {opeState[arrLength - 1] ? (<CheckCircleIcon color='success'/>) : (<CheckCircleIcon />)}
        <div>{flowsArr[arrLength - 1].operationName}</div>
        </span>
    );
    function changeState() {
        setCount((count + 1) % (arrLength + 1));
        console.log(count)
        var newOpeState = [];
        for(let i = 0; i < arrLength; i++)
            if(i < count) newOpeState.push(true);
            else newOpeState.push(false);
        setOpeState(newOpeState);
    }
    
    return (
        <div className='singleFlow'>
            <h3>
                {flowName}
                <span className='flow-button'>
                    {(count - 1 + arrLength) %(arrLength + 1) !== arrLength - 1 ?
                        <Button variant="outlined" onClick={() => changeState()}> {(count - 1 + arrLength) %(arrLength + 1) < arrLength ? "Next Step" : "Start learn"} </Button>
                    :   <Button variant="outlined" color = "success" onClick={() => changeState()}> Finished </Button>}
                </span>
            </h3>
            <div className='flow-content'>{content}</div>
            <div className='flow-items'>{items}</div>
            {(count - 1 + arrLength) %(arrLength + 1) < arrLength ? <FlowContent name = {flowsArr[(count - 1 + arrLength) % (arrLength + 1)].operationName} imgUrl = {flowsArr[(count - 1 + arrLength) %(arrLength + 1)].url} content = {flowsArr[(count - 1 + arrLength) % (arrLength + 1)].intro}/> : null}
        </div>
    )
}

export default SingleFlow
