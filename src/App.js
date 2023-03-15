import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from './pages_front/home/home.tsx';
import Learn from './pages_front/learn/learn.tsx';
import Guide from './pages_front/guide/guide.tsx';
import Exam from './pages_front/exam/exam.tsx';
import NavBar from "./Components/Navbar.tsx";
import UserInfo from "./pages_back/userInfo/userInfo.tsx";
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
				<Route path='/learn' element={<Learn />} />
				<Route path='/guide' element={<Guide />} />
				<Route path='/exam' element={<Exam />} />
				<Route path='/userinfo' element={<UserInfo />} />
			</Routes>
			</div>
		</BrowserRouter>
  );
}

export default App;