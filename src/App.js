import React,{ useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
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
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";
import "./App.css";

function App() {
  
  return (
		<BrowserRouter>
			<NavBar />
			<div className="App">
			<Routes >
				<Route path='/' element={<Home />} />
				<Route path='/caselearn' element={<CaseLearnVer2 />} />
				<Route path='/guide' element={<Guide />} />
				<Route path='/exam' element={<Exam />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register  />} />
				<Route path='/examdetail' element={<ExamDetail />} />
				<Route path='/dutyLearn' element={<DutyLearn />}/>
				<Route path="/dutyLearn/role/:roleName" element={<Role />} /> 
				<Route path='/systemManage/*' element={<SystemManage />} />
			</Routes>
			</div>
			<Footer />
		</BrowserRouter>
  );
}

export default App;