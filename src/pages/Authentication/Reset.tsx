import React, { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import { useLocation } from "react-router-dom";
import { Error } from "../Error";

export const Reset = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        console.log(email, token);
    }, [])

    // const isValidPassword = (password: string) => {
    //     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{8,}$/;
    //     return passwordRegex.test(password);
    // };

    // const [passwordError, setPasswordError] = useState("")

    const resetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://85.190.242.108:4483/api/Auth/ResetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, token, newPassword, confirmPassword })
            });

            if (response.ok) {
                const data = await response.text();
                Swal.fire({
                    title: 'Success!',
                    text: data,
                    icon: 'success',
                    customClass: 'w-[420px]',
                    showConfirmButton: false,
                    timer: 4000
                });
            } else {
                const errorData = await response.text();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData,
                    timer: 3000,
                });
            }
        } catch (error: any) {
            Swal.fire({
                title: 'Error!',
                text: error,
                icon: 'error',
                customClass: 'w-[420px]',
                showConfirmButton: false,
                timer: 4000
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
            {
                !email ? <Error /> : <div className="text-black">
                    <div className="flex justify-center items-center w-full h-screen">
                        <div className="w-4/5 lg:w-[520px] lg:p-16 lg:shadow-2xl lg:shadow-sky-200 lg:rounded-lg md:w-[400px] bg-white">

                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                <div className="flex justify-center">
                                    <FontAwesomeIcon icon={faKey} className="text-sky-700 text-4xl" />
                                </div>
                                <div className="flex flex-col justify-center items-center gap-3 my-4">
                                    <p className="text-black font-sans font-semibold text-xl">Create A Strong Password</p>
                                    <p className="text-black text-center max-w-84">Your password must contain both uppercase and lowercase letters, as well as numbers.</p>
                                </div>
                            </div>

                            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                                <div className="space-y-2">
                                    {/* {passwordError && (
                                <p className="text-red-600 text-sm mb-2">{passwordError}</p>
                            )} */}
                                </div>
                                <form className="space-y-4">
                                    <div className="relative">
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="New Password"
                                            required
                                            className="block w-full rounded-md border-0 bg-white py-2.5 px-1.5 text-black lg:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-none focus:ring-inset sm:text-sm sm:leading-6"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center mr-4">
                                            {showPassword ? (
                                                <FontAwesomeIcon icon={faEye} onClick={() => setShowPassword(false)} className="text-gray-400 cursor-pointer w-6 h-auto" />
                                            ) : (
                                                <FontAwesomeIcon icon={faEyeSlash} onClick={() => setShowPassword(true)} className="text-gray-400 cursor-pointer w-6 h-auto" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm Password"
                                            required
                                            className="block w-full rounded-md border-0 bg-white py-2.5 px-1.5 text-black lg:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-none focus:ring-inset sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <button
                                        onClick={(e) => resetPassword(e)}
                                        className="flex w-1/2 m-auto justify-center rounded-md bg-sky-600 px-3 py-2 text-md font-semibold leading-8 text-white shadow-sm hover:bg-sky-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                                        Reset
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default Reset;