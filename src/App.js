import React,{ useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from './pages_front/home/home.tsx';
import CaseLearn from './pages_front/learnCase/caselearn.tsx';
import DutyLearn from './pages_front/learnDuty/dutyLearn.tsx';
import Detail from "./pages_front/learnCase/details.tsx";
import Guide from './pages_front/guide/guide.tsx';
import Exam from './pages_front/exam/exam.tsx';
import NavBar from "./components/Navbar.tsx";
import UserInfo from "./pages_back/userInfo/userInfo.tsx";
import Footer from "./components/footer.tsx";
import Role from './pages_front/learnDuty/role/newRole.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";
import "./App.css";

function App() {
  
  return (
		<BrowserRouter>
			<NavBar />
			<div className="App">
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/caselearn' element={<CaseLearn />} />
					<Route path='/guide' element={<Guide />} />
					<Route path='/exam' element={<Exam />} />
					<Route path='/userinfo' element={<UserInfo />} />
					<Route path='/detail' element={<Detail />} />
					<Route path='/dutyLearn' element={<DutyLearn />}/>
					<Route path="/dutyLearn/role/:roleName" element={<Role />} /> 
				</Routes>
			</div>
			<Footer />
		</BrowserRouter>
  );
}

export default App;