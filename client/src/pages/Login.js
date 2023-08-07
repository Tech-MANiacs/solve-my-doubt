import React from 'react'
import '../styles/RegisterStyles.css'
import { Form, Input, message } from 'antd';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import LoginCard from './loginCard';
import RegisterCard from './registerCard';
import TopBar from './TopBar';
const Login = () => {
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    const handleSignUpClick = () => {
        setIsSignUpMode(true);
    };

    const handleSignInClick = () => {
        setIsSignUpMode(false);
    };

  return (
    <>
    <div>
      <TopBar isSignUpMode={isSignUpMode} />
      <div className={`relative min-w-full bg-white min-h-[100vh] overflow-hidden container ${isSignUpMode? "sign-up-mode" : ""} `}>
        <div className="absolute w-full h-full top-0 left-0 forms-container">
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-3/4 w-1/2 grid z-[5] transition duration-1000 delay-700 ease-in-out signin-signup">
            <LoginCard />

            <RegisterCard />
          </div>
        </div>
        
        <div className="panels-container">
          <div className="panel left-panel justify-center">
            
            <div className="content self-center pt-32">
              <h3 className="">New here ?</h3>
              <button className="btn transparent" id="sign-up-btn" onClick={handleSignUpClick}>
                Sign up
              </button>
            </div>
            <img src="singin.png" className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content self-center">
              <h3 className='pt-24'>One of us ?</h3>
              <button className="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>
                Sign in
              </button>
            </div>
            <img src="register.png" className="image" alt="" />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login