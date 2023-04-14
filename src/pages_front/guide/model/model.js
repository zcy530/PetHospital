import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useSelector } from "react-redux";
import './model.css';
import Drug from './drug.js'


function Model() {  
  const [department, Setdepartment] = useState("前台");
  const [result, Setresult] = useState([]);
  const [description, Setdescription] = useState("包括接待挂号、导医咨询、病历档案发出与回收、收费等。");
  const [headDescription, SetheadDescription] = useState("前台");
  const [showDrugs, SetshowDrugs] = useState(false);
  const [onDrug, Setondrug] = useState({});
  const [items, Setitems] = useState([]);
  const [drugs, Setdrugs] = useState([]);
  const userLogin = useSelector(state => state.userLogin)
  const token = userLogin.userInfo.headers.authorization;
  var headName = "张三"; 
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
    Setondrug(res.data.result[0]);
  }).catch(err => {
    console.log(err);
  })
  useEffect(() => {
    window.addEventListener('message', (e) => {
      if(e.data === "zhenshi") {
        Setdepartment("诊室");
        Setdescription(result[2].intro);
        SetheadDescription(result[2].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "qiantai") {
        Setdepartment("前台");
        Setdescription(result[3].intro);
        SetheadDescription(result[3].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "danganshi") {
        Setdepartment("档案室");
        Setdescription(result[1].intro);
        SetheadDescription(result[1].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "mianyishi") {
        Setdepartment("免疫室");
        Setdescription(result[4].intro);
        SetheadDescription(result[4].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "huayanshi") {
        Setdepartment("化验室");
        Setdescription(result[0].intro);
        SetheadDescription(result[0].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "yingxiangshi") {
        Setdepartment("影像室");
        Setdescription(result[5].intro);
        SetheadDescription(result[5].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "jianchashi") {
        Setdepartment("专科检查室");
        Setdescription(result[6].intro);
        SetheadDescription(result[6].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "chuzhishi") {
        Setdepartment("处置室");
        Setdescription(result[7].intro);
        SetheadDescription(result[7].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "yaofang") {
        Setdepartment("药房");
        Setdescription(result[8].intro);
        SetheadDescription(result[8].peopleList);
        initItems();
      }
      if(e.data === "zhusheshi") {
        Setdepartment("注射室");
        Setdescription(result[9].intro);
        SetheadDescription(result[9].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "shoushuzhunbeishi") {
        Setdepartment("手术准备室");
        Setdescription(result[10].intro);
        SetheadDescription(result[10].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "shoushushi") {
        Setdepartment("手术室");
        Setdescription(result[11].intro);
        SetheadDescription(result[11].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "zhuyuanbu") {
        Setdepartment("住院部");
        Setdescription(result[12].intro);
        SetheadDescription(result[12].peopleList);
        SetshowDrugs(false);
      }
      if(e.data === "jiepoushi") {
        Setdepartment("病理解剖室");
        Setdescription(result[13].intro);
        SetheadDescription(result[13].peopleList);
        SetshowDrugs(false);
      }
    }, false);
  })
  function initItems(){
    SetshowDrugs(true);
    var newItems = [];
    newItems.push(<li className='dot selected' onClick={Setondrug(drugs[0])}></li>);
    for(let i = 1; i < drugs.length; i++){
      newItems.push(<li className='dot' onClick={Setondrug(drugs[i])}></li>)
    }
    Setitems(newItems);
  }
  let prevCurr = - 1, curr = 0;
  const prev = () => {
    const dots = document.querySelectorAll('.dot');
    prevCurr = curr;
    curr = curr - 1;
    showSlide(dots);
  }
  const next = () =>{
    const dots = document.querySelectorAll('.dot');
    prevCurr = curr;
    curr = curr + 1;
    showSlide(dots);
  }
  const showSlide =  (dots) => {
    console.log(dots[0].classList);
    if(prevCurr >= 0 && prevCurr < dots.length - 1) dots[prevCurr].classList.remove('selected');
    dots[(curr + dots.length) % dots.length].classList.add('selected');
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
        <h3> { headName } </h3>
          <div className = 'headDescription'>
            { headDescription }
          </div>
        </div>
        {showDrugs ? 
        <div className = "drugs">
          <div className='drug-content'>
            <Drug name = {onDrug.name} type = {onDrug.type} intro = {onDrug.intro} price = {onDrug.price}/>
          </div>
          <a className="prev" onClick={prev()}>&lt;</a>
          <a className="next" onClick={next()}>&gt;</a>
          <ul className='nav'>
            {items}
          </ul>
        </div>
        : null}
      </div>
    </div>
  )
}

export default Model
