
import { React,useRef, useState, useEffect } from 'react';
import jwt from "jwt-decode";
import axios from './api/axios';
 import './Login.css';
import {Home} from './Home';
import {Department} from './Department';
import {Employee} from './Employee';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter, useNavigate } from "react-router-dom";
import App from './App';
const LOGIN_URL = 'https://localhost:7014/api/Login/login';
const headers = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Content-Type': 'application/json'

};

 const Login = () => {

    const userRef = useRef();
    const errRef = useRef();
    const [UserName, setUser] = useState('');
    const [Password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [UserName, Password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

      const response = await axios.post(LOGIN_URL, 
        JSON.stringify({ UserName, Password }),{headers}
        )
        const user = jwt(response.data);
            console.log("Token: ",user);
            const accessToken = response?.data;
         console.log("AccessToken :", accessToken);
          
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
      <>
        {success ? (
          <main className="App">
            <Employee />
          </main>
        ) : (
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={UserName}
                required
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={Password}
                required
              />
              <button>Sign In</button>
            </form>
            <p>
              Need an Account?
              <br />
              <span className="line">
                {/*put router link here*/}
                <a href="#">Sign Up</a>
              </span>
            </p>
          </section>
        )}
      </>
    );
}
export default Login;
