import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from './pages/home/home.tsx';
import Learn from './pages/learn/learn.tsx';
import Guide from './pages/guide/guide.tsx';
import Exam from './pages/exam/exam.tsx';
import NavBar from "./components/Navbar.tsx";
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
			</Routes>
			</div>
		</BrowserRouter>
  );
}

export default App;