import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useSelector } from "react-redux";
import './flow.css'
import SingleFlow from './singleFlow.js'



function Flow({roleId}) {
  const [resLen, setresLen] = useState(0);
  const [items, setItems] = useState([]);
  const [cntItem, setcntItems] = useState(0);
  const userLogin = useSelector(state => state.userLogin)
  const token = userLogin.userInfo.data.result.token;
  useEffect(() => {
    console.log(roleId)
    if(roleId > 0){
      axios({
        url: `https://47.120.14.174:443/petHospital/roles/${roleId}/processes`,
        method: "get",
        headers: {'Authorization':token},
      }).then(res => {
        setresLen(res.data.result.length);
        setItems(res.data.result);
      }).catch(err => {
        console.log(err);
      })
    }
  },[roleId])
  const preClick = () => {
    setcntItems((cntItem - 1 + resLen) % resLen);
  }
  const nextClick = () => {
    setcntItems((cntItem + 1) % resLen);
  }

  if (items.length === 0) {
    return <></>
  }

  let onItemName = items[cntItem]?.name
  let onItemOpe = items[cntItem]?.operationDTOList
  let onItemLen = items[cntItem]?.operationDTOList.length
  let onItemIntro = items[cntItem]?.intro

  return (
    <div className='flow'>
      <div className = "pre" onClick = {preClick}>&lt;</div>
      <div className = "next" onClick = {nextClick}>&gt;</div>
      {onItemLen > 0 ? <SingleFlow flowName={onItemName} flowsArr={onItemOpe} flowsLen = {onItemLen} content={onItemIntro} /> : null}
    </div>
  )
}

export default Flow
