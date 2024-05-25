import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

interface LoginProps {
  setUserToken: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ setUserToken }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    const emailTimeout = setTimeout(() => {
      if (email) {
        validateEmail(email);
      }
    }, 500);

    return () => clearTimeout(emailTimeout);
  }, [email]);

  useEffect(() => {
    const passwordTimeout = setTimeout(() => {
      if (password) {
        validatePassword(password);
      }
    }, 500);

    return () => clearTimeout(passwordTimeout);
  }, [password]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email: string) => {
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (password: string) => {
    if (!isValidPassword(password)) {
      setPasswordError('Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number');
    } else {
      setPasswordError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value === '') {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value === '') {
      setPasswordError('');
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!emailError && !passwordError) {
      try {
        const response = await fetch('https://encodehertz.xyz/api/User/Login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });
  
        if (response.ok) {
          const data = await response.json();
          const { userId, token } = data;
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            timer: 1000,
          });
          setTimeout(() => {
            setUserToken(userId);
          }, 1000);
        } else {
          const responseData = await response.text();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: responseData,
            timer: 3000,
          });
        }
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
          timer: 3000,
        });
      }
    }
  };
  
  return (
    <>
      <img
        className="absolute lg:w-[500px] lg:ml-1 lg:bottom-0 -z-20 bottom-0 w-screen"
        src="../src/images/background.png"
        alt="background"
      />
      <div className="flex justify-center items-center w-full h-screen">
        <div className="w-4/5 lg:w-[520px] lg:p-16 lg:shadow-2xl lg:shadow-sky-200 lg:rounded-lg md:w-[400px] lg:bg-white ">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center items-center">
              <img
                className="mx-auto w-auto lg:h-24 h-16"
                src="https://encode-soft.com/images/encodeaboutimg.svg"
                alt="ENCODE logo"
              />
              <FontAwesomeIcon icon={faCodeBranch} className='text-xl lg:text-3xl'/>
              <img
                className="mx-auto lg:h-11 w-auto h-8 ml-8 mt-3"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Hertz_Car_Rental_logo.svg/2560px-Hertz_Car_Rental_logo.svg.png"
                alt="HERTZ logo"
              />
            </div>

            <h2 className="mt-6 text-center text-2xl font-semibold leading-9 tracking-tight text-black">
              Sign in
            </h2>

          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-2">
              {emailError && (
                <p className="text-red-600 text-sm">{emailError}</p>
              )}
              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
            </div>
            <form className="space-y-4">
              <div className="mt-2 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  required
                  className={`block w-full rounded-md border-0 bg-white py-2.5 px-1.5 text-black lg:text-lg shadow-sm ring-1 ring-inset focus:ring-gray-300 placeholder:text-gray-400 focus:ring-none focus:border-none sm:text-sm sm:leading-6 ${emailError ? 'ring-red-500' : 'ring-gray-300'}`}
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  required
                  className={`block w-full rounded-md border-0 bg-white py-2.5 px-1.5 text-black lg:text-lg shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${passwordError ? 'ring-red-500' : 'ring-gray-300'}`}
                  onChange={handlePasswordChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center mr-4">
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEye} onClick={handlePasswordToggle} className="text-gray-400 cursor-pointer w-6 h-auto" />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} onClick={handlePasswordToggle} className="text-gray-400 cursor-pointer w-6 h-auto" />
                  )}
                </div>
              </div>
              <div className="flex justify-end text-md mt-4">
                <Link to="/auth/forgotPassword" className="font-semibold lg:bg-white p-1 rounded text-sky-600 hover:text-sky-500">
                  Forgot password?
                </Link>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="flex w-1/2 justify-center rounded-md bg-sky-600 px-3 py-2.5 text-md font-semibold leading-8 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;