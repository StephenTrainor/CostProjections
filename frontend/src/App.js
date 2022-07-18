import './App.module.css';
import React, {  } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Background from './components/Background';

const App = () => {
  return (
    <BrowserRouter>
      <Background />
    </BrowserRouter>
  );
}

export default App;
