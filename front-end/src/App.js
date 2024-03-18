import React from 'react';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './chat/LandingPage';
import Chat from './chat/HomePage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path='/chat/:id' element={<Chat/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
