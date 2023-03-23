import React from "react"
//Navigate重定向组件
import { Navigate } from "react-router-dom"

import Home from "../../pages_front/home/home"
import UserInfo from "../userInfo/userInfo"

// const CaseManage = lazy(() => import("../caseManage/caseManage"))

// const withLoadingComponent = (comp:JSX.Element) => (
//     <React.Suspense fallback = {<div>Loading...</div>}>
//         {comp}
//     </React.Suspense>
// )

// 配置导航栏的嵌套路由
const routes = [
    {
        path: "/",
        // 默认进来的第一个页面
        element: <Navigate to="/systemMenu" />

    },
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "/userInfo",
                element: <UserInfo />
            }
        ]
    },
]

export default routes