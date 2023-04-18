import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useSelector } from "react-redux";
import './flow.css'
import SingleFlow from './singleFlow.js'



function Flow({roleId}) {
  const [resLen, setresLen] = useState(0);
  const [items, setItems] = useState([]);
  const [onItemName, setonItemName] = useState("");
  const [onItemOpe, setonItemOpe] = useState([]);
  const [onItemLen, setonItemLen] = useState(0);
  const [onItemIntro, setonItemIntro] = useState("");
  const [cntItem, setcntItems] = useState(0);
  const userLogin = useSelector(state => state.userLogin)
  const token = userLogin.userInfo.headers.authorization;
  useEffect(() => {
    axios({
      url: `https://47.120.14.174:443/petHospital/roles/${roleId}/processes`,
      method: "get",
      headers: {'Authorization':token},
    }).then(res => {
      setresLen(res.data.result.length);
      setItems(res.data.result);
      initItem();
    }).catch(err => {
      console.log(err);
    })
  })
  const preClick = () => {
    setcntItems((cntItem - 1 + resLen) % resLen);
    initItem();
  }
  const nextClick = () => {
    setcntItems((cntItem + 1) % resLen);
    initItem();
  }
  const initItem = () => {
    setonItemName(items[cntItem].name);
    setonItemOpe(items[cntItem].operationDTOList);
    setonItemLen(items[cntItem].operationDTOList.length);
    setonItemIntro(items[cntItem].intro);
  }
  return (
    <div className='flow'>
      <div className = "pre" onClick = {preClick}>&lt;</div>
      <div className = "next" onClick = {nextClick}>&gt;</div>
      {onItemLen > 0 ? <SingleFlow flowName={onItemName} flowsArr={onItemOpe} flowsLen = {onItemLen} content={onItemIntro} /> : null}
    </div>
  )
}

export default Flow
