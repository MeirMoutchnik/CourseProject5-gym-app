import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Lessons from './pages/Lessons';
import Login from './pages/Login';
import Register from './pages/Register';
import AddLesson from './pages/AddLesson';
import UpdateLesson from './pages/UpdateLesson';
import NavBar from './components/NavBar';

export default function App() {
    return (
        <div className="app-root">
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/add-lesson" element={<AddLesson />} />
                <Route path="/update-lesson/:branch_code/:lesson_code" element={<UpdateLesson />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    )
}