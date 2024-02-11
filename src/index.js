import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import reportWebVitals from './reportWebVitals';
import Home from './page/Home';
import Login from './page/Login';
import Register from './page/Register';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/register' element={<Register />}></Route>
      <Route path='/' element={<App />}>
        <Route path='/home' element={<Home />} />
      </Route>
    </>
  )
);

// Redirect logic based on the presence of storedUserData


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Toaster />
    <RouterProvider router={router} />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
