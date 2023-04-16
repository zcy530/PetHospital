import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useSelector } from "react-redux";
import './model.css';
import Drug from './drug.js';
import Vac from './vaccine.js';


function Model() {  
  const [department, Setdepartment] = useState("前台");
  const [result, Setresult] = useState([]);
  const [description, Setdescription] = useState("包括接待挂号、导医咨询、病历档案发出与回收、收费等。");
  const [headDescription, SetheadDescription] = useState("前台");
  const [showDrugs, SetshowDrugs] = useState(false);
  const [showVac, SetshowVac] = useState(false);
  const [onDrug, Setondrug] = useState({});
  const [onVac, SetonVac] = useState({});
  const [countDrug, Setcountdrug] = useState(0);
  const [countVac, SetcountVac] = useState(0);
  const [drugs, Setdrugs] = useState([]);
  const [vaccines, Setvaccines] = useState([]);
  const userLogin = useSelector(state => state.userLogin)
  const token = userLogin.userInfo.headers.authorization;
  useEffect(() => {
    axios({
      url: `https://47.120.14.174:443/petHospital/departments`,
      method: "get",
      headers: {'Authorization':token},
    }).then(res => {
      Setresult(res.data.result);
    }).catch(err => {
      console.log(err);
    })
    axios({
      url: `https://47.120.14.174:443/petHospital/drugs`,
      method: "get",
      headers: {'Authorization':token},
    }).then(res => {
      Setdrugs(res.data.result);
    }).catch(err => {
      console.log(err);
    })
    axios({
      url: `https://47.120.14.174:443/petHospital/vaccines`,
      method: "get",
      headers: {'Authorization':token},
    }).then(res => {
      Setvaccines(res.data.result);
    }).catch(err => {
      console.log(err);
    })
  },[])
  window.addEventListener('message', (e) => {
    if(e.data === "zhenshi") {
      Setdepartment("诊室");
      Setdescription(result[2].intro);
      SetheadDescription(result[2].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "qiantai") {
      Setdepartment("前台");
      Setdescription(result[3].intro);
      SetheadDescription(result[3].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "danganshi") {
      Setdepartment("档案室");
      Setdescription(result[1].intro);
      SetheadDescription(result[1].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "mianyishi") {
      Setdepartment("免疫室");
      Setdescription(result[4].intro);
      SetheadDescription(result[4].peopleList);
      SetshowDrugs(false);
      SetshowVac(true);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "huayanshi") {
      Setdepartment("化验室");
      Setdescription(result[0].intro);
      SetheadDescription(result[0].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "yingxiangshi") {
      Setdepartment("影像室");
      Setdescription(result[5].intro);
      SetheadDescription(result[5].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "jianchashi") {
      Setdepartment("专科检查室");
      Setdescription(result[6].intro);
      SetheadDescription(result[6].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "chuzhishi") {
      Setdepartment("处置室");
      Setdescription(result[7].intro);
      SetheadDescription(result[7].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "yaofang") {
      Setdepartment("药房");
      Setdescription(result[8].intro);
      SetheadDescription(result[8].peopleList);
      SetshowVac(false);
      SetshowDrugs(true);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "zhusheshi") {
      Setdepartment("注射室");
      Setdescription(result[9].intro);
      SetheadDescription(result[9].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "shoushuzhunbeishi") {
      Setdepartment("手术准备室");
      Setdescription(result[10].intro);
      SetheadDescription(result[10].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "shoushushi") {
      Setdepartment("手术室");
      Setdescription(result[11].intro);
      SetheadDescription(result[11].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "zhuyuanbu") {
      Setdepartment("住院部");
      Setdescription(result[12].intro);
      SetheadDescription(result[12].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
    if(e.data === "jiepoushi") {
      Setdepartment("病理解剖室");
      Setdescription(result[13].intro);
      SetheadDescription(result[13].peopleList);
      SetshowDrugs(false);
      SetshowVac(false);
      Setondrug(drugs[0]);
      SetonVac(vaccines[0]);
    }
  }, false);
  function preClick(){
    Setcountdrug((countDrug - 1 + drugs.length) % drugs.length);
    SetcountVac((countVac - 1 + vaccines.length) % vaccines.length);
    Setondrug(drugs[countDrug]);
    SetonVac(vaccines[countVac]);
  }
  function nextClick(){
    Setcountdrug((countDrug + 1) % drugs.length);
    SetcountVac((countVac + 1) % vaccines.length);
    Setondrug(drugs[countDrug]);
    SetonVac(vaccines[countVac]);
  }

  return (
    <div className = "modelPage">
      <div className = "singleModel">
        <iframe
          id="childFrame"
          title="医院导览"
          src="/vtour/walkthrough.html"
          style={{ width: "100%", height: "calc(700px + 2vh)" }}
        ></iframe>
      </div>
      <div className = 'modelDescription'>
        <div className = 'department'>
          <h3> { department } </h3>
          <div className = 'departmentDescription'>
            { description }
          </div>
        </div>
        <div className='head'>
        <h3> 负责人 </h3>
          <div className = 'headDescription'>
            { headDescription }
          </div>
        </div>
        {showDrugs ? 
        <div className = "drugs">
          <div className = "pre" onClick = {preClick}>&lt;</div>
          <div className = "next" onClick = {nextClick}>&gt;</div>
          <div className='drug-content'>
            <Drug name = {onDrug.name} type = {onDrug.type} intro = {onDrug.intro} price = {onDrug.price}/>
          </div>
        </div>
        : null}
        { showVac ? 
          <div className = 'vaccines'>
            <div className = "pre" onClick = {preClick}>&lt;</div>
            <div className = "next" onClick = {nextClick}>&gt;</div>
            <div className='vaccines-content'>
              <Vac name = {onVac.name} intro = {onVac.intro}/>
            </div>
          </div>
        :null}
      </div>
    </div>
  )
}

export default Model
