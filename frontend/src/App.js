
import './App.css';
import Navbar from './components/navbar/navbar';
import SignInCard from './components/signIn/signIn';
import { BrowserRouter as Router, Routes,Route, } from 'react-router-dom';
import Home from './pages/Home/Home';
import LeaveForm from './Forms/LeaveForm';
import OutpassForm from './Forms/OutpassForm';
import PLform from './Forms/PLform';
import Approved from './components/Result/Approved';
import Declined from './components/Result/Declined';
import Expired from './components/Result/Expired';
import Pending from './components/Result/Pending';
import Register from './components/signIn/Register'
function App() {
  return (
    <div className="App">
   <Router>
      <Routes>
        <Route path="/" element={<SignInCard />} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/OutpassForm" element={<OutpassForm/>} />
        <Route path="/LeaveForm" element={<LeaveForm/>} />
        <Route path="/PLform" element={<PLform/>} />
        <Route path='/Approved' element={<Approved/>}/>
        <Route path='/Declined' element={<Declined/>}/>
        <Route path='/Expired' element={<Expired/>}/>
        <Route path='/Pending' element={<Pending/>}/>
        <Route path='/Register' element={<Register/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
