"use client";
import * as React from 'react';
import './page.css'
import { motion } from 'framer-motion'
import { useState } from 'react';
import APIRequests from '@/api';
import VerifyEmailForm from './components/verifyPin';
// import { Button } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import RegisterModal from './components/registerModal';
import Script from 'next/script';

const Login = () => {
  const [modal, setModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: ""
  });

  React.useEffect(() => {
  if (localStorage.getItem("isIn") === 'true') {
    window.location.href = "/";
  }
  }, []);

  const handleChange = (e) => {
    setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const [loginStat, setLoginStat] = useState(false)
  const [otp, setOtp] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userDetails.email === "" || userDetails.password === "") {
        toast.error('Please fill all the fields!', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
        return;
      }
      const response = await APIRequests.signIn(userDetails);
      // console.log("login response", response);
      if (response.status === 200) {
        // show pop up to enter otp
        setOtp(true);
      }

      // setLoginStat(true);
      // window.location.href = "/";
    } catch (error) {
      // setLoginStat(false);
      // localStorage.setItem("isIn", 'false');
      toast.error('Login Failed!', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      console.log(error);
    }
  }

  function myFunction() {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      document.getElementById("togglePassword").className = "far fa-eye-slash";
      x.type = "text";
    } else {
      document.getElementById("togglePassword").className = "far fa-eye";
      x.type = "password";
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  }

  return (
    <div className="loginBox mob:w-52">
      <VerifyEmailForm open={otp} handleClose={() => setOtp(false)} email={userDetails.email} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0, duration: 1 }}
        exit={{ opacity: 0 }}>
        <h2>Login</h2>
        <form>
          <div className="userBox">
            <input type="text" id="userid" name="email" onChange={handleChange} onKeyDown={handleKeyPress}></input>
            <label>Email</label>
          </div>
          <div className="userBox">
            <input type="password" id="myInput" name="password" onChange={handleChange} onKeyDown={handleKeyPress}></input>
            <label>Password</label>
            <i className="far fa-eye" id="togglePassword"
              onClick={() =>
                myFunction()
              }
            ></i>

          </div>
          <div>
            <a className='submit-btn' onClick={handleSubmit}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Submit
            </a>
            <div className='text-register mt-4 w-full text-center text-sm'>
              Not a user? <a onClick={() => {
                setModal(!modal);
              }} className='hover:text-login cursor-pointer hover:underline'>Register</a>
            </div>
          </div>
        </form>
      </motion.div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GCP_API}&libraries=places`}
        // src={`https://maps.googleapis.com/maps/api/js?key=<ADD_YOUR_OWN_KEY>&libraries=places`}
        strategy="lazyOnload"
        onReady={
          () => {
            // console.log()
            // console.log("loaded script");
            
          }
        }
      />

      <RegisterModal modal={modal} setModal={setModal}/>
    </div>
  )
}

export default Login