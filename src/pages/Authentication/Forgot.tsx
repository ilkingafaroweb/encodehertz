import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmail = (email: string) => {
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  useEffect(() => {
    const emailTimeout = setTimeout(() => {
      if (email) {
        validateEmail(email);
      }
    }, 500);

    return () => clearTimeout(emailTimeout);
  }, [email]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value === '') {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('https://encodehertz.xyz/api/Auth/ForgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const responseData = await response.text();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: responseData,
          timer: 3000,
        });
        setEmail('');
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
        text: 'Please try again.',
        timer: 3000,
      });
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
        <div className="w-4/5 lg:w-[520px] lg:p-16 lg:shadow-2xl lg:shadow-sky-200 lg:rounded-lg md:w-[400px] lg:bg-white">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center">
              <FontAwesomeIcon icon={faLock} className="text-sky-700 text-4xl" />
            </div>
            <div className="flex flex-col justify-center items-center gap-2 my-4">
              <p className="text-black font-sans font-semibold text-xl">Trouble logging in?</p>
              <p className="text-black text-center max-w-80">Enter your email address we'll send you a link to get back into your account.</p>
            </div>
          </div>

          <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete='none'
                  placeholder="Email"
                  required
                  className={`block w-full rounded-md border-0 bg-white py-2.5 px-1.5 text-black lg:text-lg shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-none focus:ring-inset sm:text-sm sm:leading-6 ${emailError ? 'ring-red-500' : ''}`}
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <p className="text-red-600 text-sm mt-2">{emailError}</p>
                )}
              </div>
              <div className="flex flex-col justify-center items-center">
                <button
                  type="submit"
                  className="flex w-1/2 justify-center rounded-md bg-sky-600 px-3 py-2 text-md font-semibold leading-8 text-white shadow-sm hover:bg-sky-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Send me link
                </button>
                <Link to="/" className="font-semibold text-sky-600 hover:text-sky-500 mt-4 text-lg lg:text-sm lg:bg-white">
                  Log in?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
};

export default ForgotPassword;