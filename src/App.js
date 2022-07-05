import logo from './logo.svg';
import './App.css';
import {Home} from './Home';
import {Department} from './Department';
import {Employee} from './Employee';
import React, { useState, useRef, useEffect } from 'react';
//import Login from './Login';
import {BrowserRouter, Route,Routes,NavLink, Navigate} from 'react-router-dom';
import './main.css';

function  App() {
  // const   tok = null;
  //localStorage.getItem("Token");
  const array = ["hero-banner"];
  const images = array.map(image => {
     return <img key={image} src={require(`../image/${image}.png`) } id="main-bg"  />
  });
  return (
    //    {

    // (tok != null) ?(  <main className='App' >
    //                 <Login />
    //                   </main>
    // ):       (
    <BrowserRouter>
      <body>
        <header>
          <nav>
            <h1>Employee Management System</h1>
            <ul id="navli">
              <li className="nav-item- m-1">
                <NavLink
                  className="btn btn-light btn-outline-primary text-dark"
                  to="/home"
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item- m-1">
                <NavLink
                  className="btn btn-light btn-outline-primary text-dark"
                  to="/department"
                >
                  Department
                </NavLink>
              </li>
              <li className="nav-item- m-1">
                <NavLink
                  href="#employ"
                  className="btn btn-light btn-outline-primary text-dark"
                  to="/employee"
                >
                  Employee
                </NavLink>
              </li>
              {/* <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary text-dark" to="login">
              Login
            </NavLink>
          </li> */}
            </ul>
          </nav>
        </header>
        <div id="main">
          <div class="divider"></div>
          <div class="divider"></div>
          <div id="divimg"></div>

          {images}
          <div id="content-main">
            <h1>Welcome to Employee Management System.</h1>
          </div>
        </div>
      </body>
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/employee" element={<Employee />}></Route>
        <Route path="/department" element={<Department />}></Route>
        {/* <Route path="/login" element={<Login/>}></Route> */}
      </Routes>
    </BrowserRouter>
    //  )
    //     }
    // </>
  );}
export default App;