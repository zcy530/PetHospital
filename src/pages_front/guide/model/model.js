import React from 'react'
import './model.css';
import imgUrl from "../../../Assets/models/55dee8f88916bb8de33ad883788b424c.jpg";
import imgUrl2 from "../../../Assets/models/d8cae3cac1844c5a2598f95db9e3c619.jpg";

function Model() {  
  var department = "诊室", description = "包括诊室的布局介绍；对宠物进行临床基本检查（视、听、触、嗅等）、疾病诊断；与宠物主人交流并根据情况开具处方。", headName = "张三", headDescription = "张三的介绍";
  return (
    <div className = "modelPage">
      <div className = "singleModel">
        <iframe
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
