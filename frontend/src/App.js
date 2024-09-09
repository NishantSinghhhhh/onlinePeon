
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
import StaffRegistration from './components/signIn/StaffRegistration'
import StaffHome from './pages/StaffHome/StaffHome'
import StaffOutpass from './components/StaffOptions/StaffOutpass';
import StaffDone from './components/StaffOptions/StaffDone'
import StaffLeave from './components/StaffOptions/StaffLeave';
import StaffPL from './components/StaffOptions/StaffPL';
import HOD from './components/HOD/HOD'
import WARDEN from './components/positions/Warden'
import HODLeavePage from './components/HOD/pages/LeavePage'
import HODOutpassPage from './components/HOD/pages/OutpassPage'
import HODPLpage from './components/HOD/pages/PLpage'
import HODdonepage from './components/HOD/pages/DonePage'


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
        <Route path='/Register' element={<Register/>}/>
        <Route path='/Pending' element={<Pending/>}/>
        <Route path='/Register1' element={<StaffRegistration/>}/>
        <Route path='/StaffHome' element={<StaffHome/>}/>
        <Route path='/StaffOutpass' element={<StaffOutpass/>}/>
        <Route path='/StaffDone' element={<StaffDone/>}/>
        <Route path='/StaffLeave' element={<StaffLeave/>}/>
        <Route path='/StaffPL' element={<StaffPL/>}/>
        <Route path='/HOD' element={<HOD/>}/>
        <Route path='/warden' element={<WARDEN/>}/>
        <Route path='/HODLeavePage' element={<HODLeavePage/>}/>
        <Route path='/HODOutpassPage' element={<HODOutpassPage/>}/>
        <Route path='/HODPLpage' element={<HODPLpage/>}/>
        <Route path='/HODdonepage' element={<HODdonepage/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
