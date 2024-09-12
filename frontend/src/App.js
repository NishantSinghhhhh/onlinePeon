
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
import WARDEN from './components/HOD/WARDEN'
// import WARDEN from './components/positions/Warden'
import WARDENLeavePage from './components/HOD/pages/LeavePage'
import WARDENOutpassPage from './components/HOD/pages/OutpassPage'
import WARDENPLpage from './components/HOD/pages/PLpage'
import WARDENdonepage from './components/HOD/pages/DonePage'
import HOD from './components/MainHod/mainHod'
import HODLeavePage from './components/MainHod/pages/LeavePage'
import HODOutpassPage from './components/MainHod/pages/OutpassPage'
import HODPLpage from './components/MainHod/pages/PLpage'
import HODdonePage from './components/MainHod/pages/DonePage'
import Admin from './components/Admin/Admin'
import AdminOutpass from './components/Admin/pages/AdminOutpassPage'
import AdminLeavePage from './components/Admin/pages/AdminLeavePage';
import AdminPLpage from './components/Admin/pages/AdminPLpage';
import Search from './components/search/search';
import Box from './components/Box/Box';

import { LoginProvider } from './context/LoginContext';

function App() {
  return (
    <div className="App">
<LoginProvider>
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
        <Route path='/WARDEN' element={<WARDEN/>}/>
        <Route path='/HOD' element={<HOD/>}/>
        <Route path='/WARDENLeavePage' element={<WARDENLeavePage/>}/>
        <Route path='/WARDENOutpassPage' element={<WARDENOutpassPage/>}/>
        <Route path='/WARDENPLpage' element={<WARDENPLpage/>}/>
        <Route path='/WARDENdonepage' element={<WARDENdonepage/>}/>
        <Route path='/HODLeavePage' element={<HODLeavePage/>}/>
        <Route path='/HODOutpassPage' element={<HODOutpassPage/>}/>
        <Route path='/HODPLpage' element={<HODPLpage/>}/>
        <Route path='/HODdonePage' element={<HODdonePage/>}/>
        <Route path='/Admin' element={<Admin/>}/>
        <Route path='/AdminOutpass' element={<AdminOutpass/>}/>
        <Route path='/AdminLeavePage' element={<AdminLeavePage/>}/>
        <Route path='/AdminPLpage' element={<AdminPLpage/>}/>
        <Route path='/Search' element={<Search/>}/>
        <Route path='/Box' element={<Box/>}/>
      </Routes>
    </Router>
</LoginProvider>
    </div>
  );
}

export default App;
