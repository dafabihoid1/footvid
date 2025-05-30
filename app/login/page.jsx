"use client"
import React, { useState } from 'react'
import SignIn from './signin'
import SignUp from './signup';

const LoginPage = () => {
    const[login, setLogin] = useState("signin");
  return (
    <>
      {login === "signin" && (
        <SignIn state={login} setState={setLogin}/>
      )}
      {login === "signup" && (
        <SignUp state={login} setState={setLogin}/>
      )}
    </>
  );
}

export default LoginPage