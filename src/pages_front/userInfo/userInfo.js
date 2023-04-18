import React, {useEffect} from 'react';
import axios from "axios";

function UserInfoPage() {
    useEffect(() => {
        axios({
            url: `https://47.120.14.174:443/petHospital/user/password/forget`,
            method: "patch",
          }).then(res => {
            console.log(res.data.result);
          }).catch(err => {
            console.log(err);
          })
    }, [])
    return (
        <div>
        
        </div>
    )
}

export default UserInfoPage
