import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useSelector } from "react-redux";
import './flow.css'
import SingleFlow from './singleFlow.js'



function Flow({roleId}) {
  // var flowName = "消毒流程", flowsArr = ["剃毛","洗净","二次法","覆盖"],  content = "如何穿戴手术设备？";
  const [resLen, setresLen] = useState(0);
  const [items, setItems] = useState([]);
  const userLogin = useSelector(state => state.userLogin)
  const token = userLogin.userInfo.headers.authorization;
  useEffect(() => {
    axios({
      url: `https://47.120.14.174:443/petHospital/roles/${roleId}/processes`,
      method: "get",
      headers: {'Authorization':token},
    }).then(res => {
      setresLen(res.data.result.length);
      let newItems = [];
      for(let i = 0; i < resLen; i++){
        newItems.push( <SingleFlow flowName={res.data.result[i].name} flowsArr={res.data.result[i].operationDTOList} content={res.data.result[i].intro}/> );
      }
      setItems(newItems);
    }).catch(err => {
      console.log(err);
    })
  })
  return (
    <div className='flow'>
      {items}
    </div>
  )
}

export default Flow
