import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, message, Steps, theme } from 'antd';
import './myStep.css'
import OneStep from "./oneStep";


function MyStep({roleId}){
    const [resLen, setresLen] = useState(0);
    const [items, setItems] = useState([]);
    const userLogin = useSelector(state => state.userLogin)
    const token = userLogin.userInfo.headers.authorization;
    useEffect(() => {
        if(roleId > 0){
            axios({
                url: `https://47.120.14.174:443/petHospital/roles/${roleId}/processes`,
                method: "get",
                headers: {'Authorization':token},
            }).then(res => {
                setresLen(res.data.result.length);
                console.log(res.data.result)
                let newItems = [];
                for(let i = 0; i < res.data.result.length; i++){
                    // newItems.push( <SingleFlow flowName={res.data.result[i].name} flowsArr={res.data.result[i].operationDTOList} content={res.data.result[i].intro}/> );
                    newItems.push(<OneStep flowName={res.data.result[i].name} flowsArr={res.data.result[i].operationDTOList} content={res.data.result[i].intro}></OneStep>)

                }
                setItems(newItems);
            }).catch(err => {
                console.log(err);
            })
        }

    },[roleId])



    return (
        <>
            <div className='steps'>
                {items}
            </div>
        </>
    );
}

export default MyStep;