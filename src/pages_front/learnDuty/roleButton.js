import React from 'react'
import './roleButton.css'
import { Link } from "react-router-dom";

function roleButton({roleName, Avatar}) {
  return (
    <div className = "roleButton">
      <Avatar className="roleIcon" fontSize="large"/>
      <Link  className="roleName" to ={`/dutyLearn/role/${roleName}`}>
        <h3> {roleName}</h3>
      </Link>
    </div>
  )
}

export default roleButton
