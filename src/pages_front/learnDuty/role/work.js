import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useSelector } from "react-redux";
import './work.css'

function Work({roleName, getChildData}) {
  const [respon, setRespon] = useState("");
  const [content, setContent] = useState("");
  const [roleId, setroleID] = useState(0);
  const userLogin = useSelector(state => state.userLogin)
  const token = userLogin.userInfo.headers.authorization;
  useEffect(() => {
    if(roleName === "兽医师"){
        axios({
        url: "https://47.120.14.174:443/petHospital/roles/1",
        method: "get",
        headers: {'Authorization':token},
      }).then(res => {
        setContent(res.data.result.content);
        setRespon(res.data.result.responsibility);
        setroleID(res.data.result.roleId);
      }).catch(err => {
        console.log(err);
      })
    }
    else if(roleName === "前台"){
      axios({
        url: "https://47.120.14.174:443/petHospital/roles/3",
        method: "get",
        headers: {'Authorization':token},
      }).then(res => {
        setContent(res.data.result.content);
        setRespon(res.data.result.responsibility);
        setroleID(res.data.result.roleId);
      }).catch(err => {
        console.log(err);
      })
    }
    else if(roleName === "医助"){
      axios({
        url: "https://47.120.14.174:443/petHospital/roles/2",
        method: "get",
        headers: {'Authorization':token},
      }).then(res => {
        setContent(res.data.result.content);
        setRespon(res.data.result.responsibility);
        setroleID(res.data.result.roleId);
      }).catch(err => {
        console.log(err);
      })
    }
    getChildData(roleId);
  })
  return (
    <div className = "work">
      <div className = "work-responsibility">
        <h1>角色职责</h1>
        <div className = "work-reponsibility-word">
          {respon}
        </div>
      </div>
      <div className = "work-content">
        <h1>工作内容</h1>
        <div className = "work-content-word">
          {content}
        </div>
      </div>
    </div>
  )
}

export default Work
