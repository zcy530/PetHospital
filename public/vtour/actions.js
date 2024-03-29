/**
 * Created by 亚仪 on 2017/3/16.
 */

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

//跟换角色之后每次都将房间显示属性设置为True
function action_setAllSceneShow(){
    var str="";
    for(var i=0;i<sceneData.length;i++){
        var textname='current_location'+i.toString();
        var imgname='bd_scroller_container'+i.toString();
        str += 'set(layer['+textname+'].visible,true);';
        str += 'set(layer['+imgname+'].visible,true);';
    }
    krpano.call(str);
}
//根据角色权限设定当前起始位置
function action_setInitScene(){
    var str='';
    console.log(currentRoleId);

        str += 'loadscene(scene_qiantai, null, MERGE);';
        str += 'set(layer[current_role].html,"");';
        str += 'set(layer[current_desc].html,"包括接待挂号、导医咨询、收费等");';
        str += 'set(layer[current_location].html,"前台");';
    
    krpano.call(str);
}

//根据模式与角色权限更新场景以及场景中的具体介绍
function action_updateSceneHotspotWithRole(curScene){
    var str = '';
   if(currentMode==1){//角色扮演模式：根据角色权限更新预览场景
        for(var i=0;i<sceneData.length;i++){
            if(!roles[currentRoleId].room.contains(i)){
                var textname='current_location'+i.toString();
                var imgname='bd_scroller_container'+i.toString();
                str += 'set(layer['+textname+'].visible,false);';
                str += 'set(layer['+imgname+'].visible,false);';
            }
        }
    }
    krpano.call(str);
    return_Curscene(curScene);
}

function return_Curscene(curScene){
    window.parent.postMessage(curScene);
}
//每次切换场景时设置当前active位置
function action_setCurrentMapLocation(currole){
    if(!currole){
        lastactivemapspot='qiantai';
    }else{
        lastactivemapspot='qiantai';
        if(currole==0){
            lastactivemapspot='qiantai';
        }else if(currole==1){
            lastactivemapspot='zhenshi';
        }else if(currole==2){
            lastactivemapspot='zhusheshi';
        }else{
            console.log('action_setcurrentmaplocation() 传参有误');
        }
    }
    var str = 'layer[spot_location_'+lastActiveMapSpot+'].loadStyle('+mapSpotStyle_active+');';
    krpano.call(str);
}
//返回上级

//根据roomList修改科室名称
function action_updateSceneAndMapName(){
    var str='';
    for(var i=0;i<roomList.length;i++){
        var name=roomList[i].name;
        var title=roomList[i].title;
        str+='set(scene[scene_'+name+'].title,'+title+');';
        str+='set(layer[spot_location_'+name+'].tooltip,'+title+');';
    }
    krpano.call(str);
}
function action_updateHotspotName(){
    var str='';
    for(var i=0;i<roomList.length;i++){
        var name=roomList[i].name;
        var title=roomList[i].title;
        str+='set(hotspot[spot_'+name+'].tooltip,'+title+');';
    }
    krpano.call(str);
}
function action_loadDevice(deviceName){
    var str='';
    for(var i=0;i<deviceList.length;i++){
        var name=deviceList[i].name;
        if(deviceName==name){
            var description=deviceList[i].description;
            var video=deviceList[i].video;
            str+='set(layer[device_description].html,'+description+');';
            str+='set(layer[device_video].videourl,'+video+');';
            krpano.call(str);
            action_flyin('layer_device');
            break;
        }
    }
}
function action_flyin(layerName){
    var str='';
    str+='if(layer['+layerName+'].flying == 0.0, layer[%1].resetsize(); calc_flyout_size('+layerName+'); );';
    str+='if(layer['+layerName+'].oldscale === null, copy(layer['+layerName+'].oldscale, layer['+layerName+'].scale) );';
    str+='if(layer['+layerName+'].oldrx === null, copy(layer['+layerName+'].oldrx, layer['+layerName+'].rx) );';
    str+='if(layer['+layerName+'].oldry === null, copy(layer['+layerName+'].oldry, layer['+layerName+'].ry) );';
    str+='if(layer['+layerName+'].oldrz === null, copy(layer['+layerName+'].oldrz, layer['+layerName+'].rz) );';
    str+='set(layer['+layerName+'].enabled,true);';
    str+='set(layer['+layerName+'].visible,true);';
    str+='tween(layer['+layerName+'].alpha,  1.0);';
    str+='tween(layer['+layerName+'].flying, 1.0);';
    str+='tween(layer['+layerName+'].scale,  1.0);';
    str+='tween(layer['+layerName+'].rx, 0.0);';
    str+='tween(layer['+layerName+'].ry, 0.0);';
    str+='tween(layer['+layerName+'].rz, 0.0);';
    krpano.call(str);
}
/**********************************/
function loadRoleData(callback){
    roles = [
        {id: 0, name: '前台', room: [0, 2]},
        {id: 1, name: '兽医', room: [1, 3, 4, 5, 6, 7, 8, 9,10,11,12,13]},
        {id: 2, name: '助理', room: [4, 5, 7, 8, 9, 10,11,12]}
    ];
    callback();
}
function callback_walkthrough(){
    action_setAllSceneShow();
    action_setInitScene(currentRoleId);
}
function callback_roleplay() {
    action_setAllSceneShow();
    action_setInitScene(currentRoleId);
   // action_updateMapsWithRole();
    action_updateSceneHotspotWithRole(currentRoleId);
    action_setCurrentMapLocation();
    //action_updateSceneAndMapName();
}