import React, {useEffect, useState} from 'react';
import axios from "axios";
import './userInfo.css'
import { useSelector } from "react-redux";
import userURl from './user.svg';
import InfoBar from './infoBar.js'
import EmailIcon from '@mui/icons-material/Email';
import FaceIcon from '@mui/icons-material/Face';
import ClassIcon from '@mui/icons-material/Class';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import { Button, TextField } from '@mui/material';
import { Alert,Snackbar } from '@mui/material';

function UserInfoPage() {
    const userLogin = useSelector(state => state.userLogin);
    const token = userLogin.userInfo.data.result.token;
    const id = userLogin.userInfo.data.result.userId;
    const [userinfo, setuserinfo] = useState({});
    const [showButton, setshow] = useState(true);
    const [password, setpassword] = useState("");
    const [show, setonshow] = useState(false);
    const map = new Map();
    map.set("manager", "管理员");
    map.set("user", "普通用户");
    useEffect(() => {
      axios({
        url: `https://47.120.14.174:443/petHospital/user`,
        method: "get",
        headers: {'Authorization':token},
      }).then(res => {
        setuserinfo(res.data.result);
        setpassword(res.data.result.password);
      }).catch(err => {
        console.log(err);
      })
      console.log(showButton)
    }, [])
    const changeShow = () => {
      setshow(!showButton);
    }
    const changePassword = (newdata) => {
      axios({
          url: 'https://47.120.14.174:443/petHospital/user/password/change',
          method: "patch",
          data: {'password': newdata},
          headers: {'Authorization':token,'content-Type': 'application/json'},
        }).then(res => {
          console.log(res);
          setonshow(true);
        }).catch(err => {
          console.log(err);
        })
        changeShow();
    }
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setonshow(false);
    };
    return (
        <div className='userInfo'>
          <div className='userCard_whole'>
            <div className='userImage-up' />
            <div className='userImage-down' />
            <img className = 'image' src={userURl} alt = ""/>
            <div className='line'></div>
            <h2 className='userName'>{map.get(userinfo.role)+id}</h2>
            <div className='userCard'>
              <div className='infoCard'>
                <InfoBar Component={EmailIcon} info = {userinfo.email}/>
                <InfoBar Component={FaceIcon} info = {map.get(userinfo.role)}/>
                <InfoBar Component={ClassIcon} info = {userinfo.userClass + "班"}/>
              </div>
              <div className='passChangeCard'>
                {showButton
                ? <Button variant="text" onClick={() => changeShow()}>Change Password</Button>
                : <div className='textF'>
                  <TextField
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="standard"
                    onChange = {(e) => setpassword(e.target.value)}
                  />
                  <AutoFixNormalIcon fontSize = "large" onClick={() => changePassword(password)}/>
                </div>}
                {show && 
                <Snackbar open={show} anchorOrigin={{vertical : 'top', horizontal : 'center',}} autoHideDuration={1000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                  密码修改成功！
                  </Alert>
                </Snackbar>
                }
              </div>
            </div>
          </div>
        </div>
    )
}

export default UserInfoPage
