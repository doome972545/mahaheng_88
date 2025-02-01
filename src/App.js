// import logo from './logo.svg';
import './App.css';
// import { useState } from 'react';
import Home from './page/Home';
import Header from './components/Header';
import Login from './page/Login';

function App() {
  const storedUserData = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {
        storedUserData ?
          <>
          <Header/>
            <Home></Home>
          </>
          :
          <Login></Login>
      }
    </>
  );
}

export default App;
