import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from './Landing/Landing'
import Signup from "./LoginSignUp/Signup";
import Login from "./LoginSignUp/Login";
import Dashboard from "./Dashboard/Dashboard";
import TeacherDashboard from "./TeacherDashboard/TeacherDashboard";
import AdminDashboard from "./Admin/AdminDashboard"
import { UserContextProvider } from "./UserContext";

// import './App.css'


function App() {

  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teacherdashboard" element={<TeacherDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
