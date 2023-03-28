import React, { useEffect } from 'react'
import Work from './work.js';
import Flow from './flow.js';
import './newRole.css';
import {useParams, Link} from "react-router-dom";


function NewRole() {
  const params = useParams();
  useEffect(() => {
    console.log(params)
  })
  return (
    <div className='newRole'>
        <div className = "Navi_Bar">
          <h1>{params.roleName}角色流程学习</h1>
          <Link className='text_a' to = "/dutyLearn">角色扮演/</Link>
          <Link className='text_b' to = {`/dutyLearn/role/${params.roleName}`}>{params.roleName}</Link>
        </div>
        <Work roleName={params.roleName}/>
        <Flow />  
    </div>
  )
}

export default NewRole;
