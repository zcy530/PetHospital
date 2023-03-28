import React, {useState, useEffect} from 'react'
import axios from "axios";
import './work.css'

function Work({roleName}) {
  const [respon, setRespon] = useState("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  const [content, setContent] = useState("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
  useEffect(() => {
    // axios({
    //   url: "/roles/1",
    //   method: "get",
    //   headers: {'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6Im1hbmdlciIsImlzcyI6InNlY3VyaXR5IiwiaWF0IjoxNjc5NjI2NDY1LCJhdWQiOiJzZWN1cml0eS1hbGwiLCJleHAiOjE2Nzk2MzM2NjV9.ohYtyue_0tBR1JyQqfGSZHspbPP6R6bYhAG9K0uHQfw'},
    // }).then(res => {
    //   console.log(res);
    // }).catch(err => {
    //   console.log(err);
    // })
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
