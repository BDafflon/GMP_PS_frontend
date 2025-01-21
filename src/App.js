import React from 'react';
import { BrowserRouter, Route, Routes  } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashbord/Dashbord';
import Login from './pages/Login';
import useToken from './utils/useToken';
import Registration from './pages/Registration';

function App() {
  const { token, setToken } = useToken();
  

  if(!token){
    //console.log('?')
    return (<div className='wrapper'>
    
    <BrowserRouter>
     <Routes>
        
       <Route path='/login' element={<Login setToken={setToken}/>} />
       <Route path='/registration' element={<Registration/>} />
       <Route path="*" element={<Login setToken={setToken}/>} />
     </Routes>
    </BrowserRouter>

  </div>)
  }
  return (
     <div className='wrapper'>
       
       <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<Dashboard token={token}/>} />
          <Route path="*" element={<Dashboard token={token}/>} />

        </Routes>
       </BrowserRouter>

     </div>
  );
}

export default App;