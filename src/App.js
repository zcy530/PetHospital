import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages_front/home/home.tsx';
import CaseLearn from './pages_front/learnCase/caselearn.tsx';
import Detail from "./pages_front/learnCase/details.tsx";
import Guide from './pages_front/guide/guide.tsx';
import Exam from './pages_front/exam/exam.tsx';
import NavBar from "./Components/Navbar.tsx";
import Footer from "./Components/footer.tsx";
import SystemManage from "./pages_back/systemManage.tsx";
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
				<Route path='/detail' element={<Detail />} />
				<Route path='/systemManage/*' element={<SystemManage />} />
			</Routes>
			</div>
			<Footer />
		</BrowserRouter>
  );
}

export default App;