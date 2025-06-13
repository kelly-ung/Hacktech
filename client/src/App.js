import './App.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import Resources from './components/Resources';
import ChatApp from './components/ChatApp';  
import AuthPage from './components/AuthPage';

const App = () => {
  const[loggedIn, setLoggedIn] = useState(false);
  const[userId, setUserId] = useState(null);
  
  return (
    <div className="App">
        <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/Home' element={<Home loggedIn={loggedIn} userId={userId} />} />
          <Route path='/Resources' element={<Resources />} />
          <Route path='/ChatApp' element={<ChatApp />} /> 
          <Route path='/AuthPage' element={<AuthPage setLoggedIn={setLoggedIn} setUserId={setUserId} />} />
        </Routes>
    </div>
  );
}

export default App;
