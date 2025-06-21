
import {Route,Routes} from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import Home from './views/Home/Home'
import Reservation from './views/Reservation/Reservation'
import Payment from './views/Payment/Payment'
import Tariffs from './views/Tariffs/Tariffs'
import Rack from './views/Rack/Rack'
import Contact from './views/Contact/Contact'
import Reports from './views/Reports/Reports'
import LapsReport from './components/LapsReport/LapsReport'
import GroupReport from './components/GroupReport/GroupReport'

function App() {


  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<Reservation />}/>
        <Route path="/payment" element={<Payment />}/>
        <Route path="/tariffs" element={<Tariffs />}/>
        <Route path="/rack" element={<Rack />}/>
        <Route path="/reports" element={<Reports />}/>        
        <Route path="/laps-report" element={<LapsReport />} />
        <Route path="/group-report" element={<GroupReport />} />
        <Route path="/contact" element={<Contact />}/>
      </Routes>
    </div>
  )
}

export default App
