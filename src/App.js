import React,{ useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useSelector } from "react-redux";
import Home from './pages_front/home/home.tsx';
import CaseLearnVer2 from './pages_front/learnCase/caseLearnVer2.tsx';
import DutyLearn from './pages_front/learnDuty/dutyLearn.tsx';
import Guide from './pages_front/guide/guide.tsx';
import Exam from './pages_front/exam/exam.tsx';
import NavBar from "./components/Navbar.tsx";
import Footer from "./components/footer.tsx";
import Role from './pages_front/learnDuty/role/newRole.js'
import SystemManage from "./pages_back/systemManage.tsx";
import Register from './pages_front/register/register.tsx';
import Login from './pages_front/login/login.tsx';
import ExamDetail from './pages_front/exam/examDetail.tsx';
import UserInfo from './pages_front/userInfo/userInfo.tsx';
import ForgetPassword from './pages_front/forgetPassword/forget.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";
import "./App.css";

function App() {
	const userLogin = useSelector(state => state.userLogin)
  	const { userInfo } = userLogin
  
  return (
		<BrowserRouter>
			<NavBar />
			<div className="App">
			<Routes >
				<Route path='/' element={<Home />} />
				<Route path='/caselearn' element={<CaseLearnVer2 />} />
				<Route path='/guide' element={userInfo ? <Guide /> : <Login />} />
				<Route path='/exam' element={<Exam />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register  />} />
				<Route path='/examdetail' element={<ExamDetail />} />
				<Route path='/dutyLearn' element={userInfo ? <DutyLearn /> : <Login />}/>
				<Route path="/dutyLearn/role/:roleName" element={userInfo ? <Role /> : <Login />} /> 
				<Route path="/userinfo" element={userInfo ? <UserInfo /> : <Login />}/>
				<Route path='/systemManage/*' element={<SystemManage />} />
				<Route path='/forgetPassword' element = {<ForgetPassword />} />
			</Routes>
			</div>
			<Footer />
		</BrowserRouter>
  );
}

export default App;