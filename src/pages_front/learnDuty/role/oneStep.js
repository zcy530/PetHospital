import React, { useState, useEffect } from 'react'
import {Button, Col, message, Row, Steps, theme} from 'antd';
import './oneStep.css'
import FlowContent from "./flowContent";


function OneStep({flowName, flowsArr,content}){
    const [current, setCurrent] = useState(0);
    const [steps,setSteps]=useState([])
    const [items,setItems]=useState([])
    const [startSteps,setStartSteps] =useState(false)

    const completeMessage=()=>{
        console.log('onChange2:');
        message.success('Process complete!').then(r => setCurrent(0))
    }
    const onChange = (value: number) => {
        console.log('onChange:', value);
        setCurrent(value);
        if(value === flowsArr.length - 1){
           completeMessage()
        }
    };
    useEffect(() => {
        if(flowsArr){
            console.log("flowsArr",flowsArr)
            console.log(content)
            const newSteps=[]

            for(let i = 0; i < flowsArr.length; i++){
                let name = flowsArr[i].operationName;
                let intro = flowsArr[i].intro;
                const newStep=new Map()
                newStep.set('id',i)
                newStep.set("title",name)
                newStep.set("content",intro)
                newSteps.push(newStep)
            }

            setSteps(newSteps)
            const items2 = newSteps.map((item) => ({ key: item.get('id'), title: item.get('title') }))
            setItems(items2);
            setStartSteps(true)

        }

    }, [flowName]);


    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

        if(!startSteps)return <></>
        else{
            return (
                <>
                    <div className='step'>
                        <Row>
                            <Col span={23}>
                                <Steps current={current} items={items} onChange={onChange} size={"small"} />
                            </Col>
                            <Col span={1}>
                            </Col>
                        </Row>
                        <Row>
                            <div>
                                <FlowContent name = {flowName}
                                             imgUrl = {flowsArr[current].url}
                                             content = {flowsArr[current].intro}
                                             content2={content}
                                             title = {flowsArr[current].operationName}/>
                            </div>
                        </Row>

                        {/*<div style={{ marginTop: 24 ,marginBottom:24}}>*/}
                        {/*    /!*{current < steps.length - 1 && (*!/*/}
                        {/*    /!*    <Button type="primary" onClick={() => next()}>*!/*/}
                        {/*    /!*        Next*!/*/}
                        {/*    /!*    </Button>*!/*/}
                        {/*    /!*)}*!/*/}
                        {/*    /!*{current === steps.length - 1 && (*!/*/}
                        {/*    /!*    <Button type="primary" onClick={() => message.success('Processing complete!')}>*!/*/}
                        {/*    /!*        Done*!/*/}
                        {/*    /!*    </Button>*!/*/}
                        {/*    /!*)}*!/*/}
                        {/*    /!*{current > 0 && (*!/*/}
                        {/*    /!*    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>*!/*/}
                        {/*    /!*        Previous*!/*/}
                        {/*    /!*    </Button>*!/*/}
                        {/*    /!*)}*!/*/}
                        {/*</div>*/}

                    </div>
                </>
            )
        }

}

export default OneStep;