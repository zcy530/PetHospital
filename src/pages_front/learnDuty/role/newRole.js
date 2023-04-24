import React, { useEffect, useState } from 'react'
import Work from './work.js';
import Flow from './flow.js';
import './newRole.css';
import {useParams, Link} from "react-router-dom";


function NewRole() {
  const params = useParams();
  const [roleId, setroleId] = useState(0);
  const setId = (e) => {
 
    setroleId(e);
  }
  useEffect(() => {
    // console.log(params)
    console.log("roleId"+roleId)
  })
  return (
    <div className='newRole'>
        <div className = "Navi_Bar">
          <h1>{params.roleName}角色流程学习</h1>
          <Link className='text_a' to = "/dutyLearn">角色扮演/</Link>
          <Link className='text_b' to = {`/dutyLearn/role/${params.roleName}`}>{params.roleName}</Link>
        </div>
        <Work roleName={params.roleName} setRoleId={setId} roleId={roleId}/>
        <Flow roleId = {roleId}/>  
    </div>
  )
}

export default NewRole;
