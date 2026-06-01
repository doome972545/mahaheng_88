import React from "react";
import './App.css';
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
