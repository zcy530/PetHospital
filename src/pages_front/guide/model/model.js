import React, { useEffect, useState } from 'react'
import './model.css';


function Model() {  
  const [department, Setdepartment] = useState("诊室");
  var description = "包括诊室的布局介绍；对宠物进行临床基本检查（视、听、触、嗅等）、疾病诊断；与宠物主人交流并根据情况开具处方。", headName = "张三", headDescription = "张三的介绍";
  useEffect(() => {
    window.addEventListener('message', (e) => {
      if(e.data === "zhenshi") {Setdepartment("诊室");}
      if(e.data === "qiantai") {Setdepartment("前台");}
      if(e.data === "danganshi") {Setdepartment("档案室");}
      if(e.data === "mianyishi") {Setdepartment("免疫室");}
      if(e.data === "huayanshi") {Setdepartment("化验室");}
      if(e.data === "yingxiangshi") {Setdepartment("影像室");}
      if(e.data === "jianchashi") {Setdepartment("专科检查室");}
      if(e.data === "chuzhishi") {Setdepartment("处置室");}
      if(e.data === "yaofang") {Setdepartment("药房");}
      if(e.data === "zhusheshi") {Setdepartment("注射室");}
      if(e.data === "shoushuzhunbeishi") {Setdepartment("手术准备室");}
      if(e.data === "shoushushi") {Setdepartment("手术室");}
      if(e.data === "zhuyuanbu") {Setdepartment("住院部");}
      if(e.data === "jiepoushi") {Setdepartment("病理解剖室");}
    }, false);
  })
  return (
    <div className = "modelPage">
      <div className = "singleModel">
        <iframe
          id="childFrame"
          title="医院导览"
          src="/vtour/walkthrough.html"
          style={{ width: "100%", height: "100vh" }}
        ></iframe>
      </div>
      <div className = 'modelDescription'>
        <div className = 'department'>
          <h3> { department } </h3>
          <div className = 'departmentDescription'>
            { description }
          </div>
        </div>
        <div className='headDescription'>
        <h3> { headName } </h3>
          <div className = 'departmentDescription'>
            { headDescription }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Model
