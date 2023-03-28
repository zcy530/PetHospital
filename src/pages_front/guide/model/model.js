import React, {useState} from 'react'
import VrReact from 'vr-react';
import './model.css';
import imgUrl from "../../../Assets/models/55dee8f88916bb8de33ad883788b424c.jpg";
import imgUrl2 from "../../../Assets/models/d8cae3cac1844c5a2598f95db9e3c619.jpg";

function Model() {  
    const config = {
        autoRotate: 0,
        hfov: 60,
        minHfov: 10,
        maxHfov: 60,
  };
  const scenes = {
    oneScene: {
      type: "equirectangular",
      panorama: imgUrl,
    },
    twoScene: {
      type: "equirectangular",
      panorama: imgUrl2,
    },
      threeScene: {
        type: "equirectangular",
        panorama: imgUrl,
      },
      fourScene: {
        type: "equirectangular",
        panorama: imgUrl2,
      },
  };
  const hotSpots = [
    {
      pitch: -10, // 指定热点位置的俯仰部分
      yaw: 0, // 指定热点位置的偏航部分
      clickHandlerFunc: () => {}, // 热点被点击函数
      scale: true, // VR缩放时，热点是否自动缩放以匹配相对于VR的视野变化 默认为false
      sId: "oneScene", // 热点需要加载到那个场景下，必传
      text: "热点自带Tooltip", // 热点自带Tooltip，设置为空或不设置则不会显示
    },
    {
      pitch: 20, // 指定热点水平方向偏移角度
      yaw: 0, // 指定热点垂直方向偏移角度
      cssClass: ["campGate-hot"], // 热点的class类名，设置样式, 默认是空数组, 如果传值了则会覆盖默认热点样式
      clickHandlerFunc: () => {
        viewer.loadScene("twoScene");
      }, // 热点被点击函数
      sId: "oneScene", // 热点需要加载到那个场景下，必传
    },
    {
      sId: "twoScene", // 热点需要加载到那个场景下，必传
      cssClass: ["campGate-hot"],
      clickHandlerFunc: () => {
        viewer.loadScene("threeScene");
      },
    },
    {
      sId: "threeScene",
      cssClass: ["campGate-hot"],
      clickHandlerFunc: () => {
        viewer.loadScene("fourScene");
      },
    },
    {
      sId: "fourScene",
      cssClass: ["campGate-hot"],
      clickHandlerFunc: () => {
        viewer.loadScene("oneScene");
      },
    },
    {
      pitch: -20,
      yaw: 20,
      sId: "fourScene",
      text: "第四个场景",
    },
  ];
  const [viewer, setViewer] = useState(null);
  var department = "诊室", description = "包括诊室的布局介绍；对宠物进行临床基本检查（视、听、触、嗅等）、疾病诊断；与宠物主人交流并根据情况开具处方。", headName = "张三", headDescription = "张三的介绍";
  return (
    <div className = "modelPage">
      <div className = "singleModel">
        <VrReact
          setViewer={setViewer}
          config={config}
          width="100%"
          height="100vh"
          firstSceneId="oneScene"
          scenes={scenes}
          hotSpots={hotSpots}
          delayTime={0}
        />
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
