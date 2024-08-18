import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLock, faEyeSlash, faCircleCheck, faUsers, faEnvelope, faUser, faLanguage } from "@fortawesome/free-solid-svg-icons";

interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  groups: string[];
  // imageUrl: string | null;
  // imageUpload: any;
  selectedLanguage: string;
  languages: { value: string; text: string }[];
  password: string;
  confirmPassword: string;
}

const initialUserProfile: UserProfile = {
  id: "",
  name: "",
  surname: "",
  email: "",
  groups: [],
  // imageUrl: null,
  // imageUpload: null,
  selectedLanguage: "",
  languages: [],
  password: "",
  confirmPassword: ""
}

const Profile: React.FC = () => {
  const token = localStorage.getItem('token')
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmInput, setShowConfirmInput] = useState(false)

  useEffect(() => {
    console.log("User Profile Update Data: ", userProfile);
  }, [userProfile])

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
      fetch(`https://encodehertz.xyz/api/User/Profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          setUserProfile(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
  }, []);

  const handleSave = () => {
    fetch('https://encodehertz.xyz/api/User/UpdateProfile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userProfile.id,
        name: userProfile.name,
        surname: userProfile.surname,
        email: userProfile.email,
        selectedLanguage: userProfile.selectedLanguage,
        password: userProfile.password,
        confirmPassword: userProfile.confirmPassword
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: data
      });
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error
      });
      console.error('There was an error!', error);
    });
  };

  const handleChangePassword = () => {
    setShowConfirmInput(true);
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your data has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your data is safe :)', 'error');
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Profile" prevPageName='dashboard_lbl' prevRoute='/'/>
        <div className="grid gap-8 max-w-180 mx-auto">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form>
                  {/* <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <img src={"https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"} alt="User" />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2.5">
                        <button className="text-sm hover:text-primary" onClick={handleDelete}>
                          Delete
                        </button>
                      </span>
                    </div>
                  </div> */}

                  {/* <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div> */}

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Name"
                      >
                        Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3.5">
                          <FontAwesomeIcon icon={faUser} />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="name"
                          id="Name"
                          placeholder="Please enter your name"
                          value={userProfile.name}
                          onChange={(e) => {
                            handleInputChange(e);
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Surname"
                      >
                        Surname
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3.5">
                          <FontAwesomeIcon icon={faUser} />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="surname"
                          id="Surname"
                          placeholder="Please enter your surname"
                          value={userProfile.surname}
                          onChange={(e) => {
                            handleInputChange(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Email"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3.5">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="email"
                          name="email"
                          id="Email"
                          placeholder="Please enter your email"
                          value={userProfile.email}
                          onChange={(e) => {
                            handleInputChange(e);
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Language"
                      >
                        Language
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3.5">
                          <FontAwesomeIcon icon={faLanguage} />
                        </span>
                        <select
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          name="selectedLanguage"
                          id="Language"
                          // value={userProfile.selectedLanguage}
                          onChange={(e) => {
                            handleInputChange(e);
                          }}
                        >
                          <option value="" className='hidden'>Select Language</option>
                          {userProfile.languages.map(lang => (
                            lang.value === "EN" ? <option key={lang.value} value={lang.value} selected>{lang.text}</option> : <option key={lang.value} value={lang.value}>{lang.text}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="password"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3.5">
                          <FontAwesomeIcon icon={faLock} />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          id="password"
                          placeholder="Please enter new password"
                          value={userProfile.password}
                          onChange={(e) => {
                            handleInputChange(e);
                            handleChangePassword();
                          }}
                        />
                        <span className="absolute right-4.5 top-3.5">
                          <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                            onClick={handlePasswordToggle}
                            className="cursor-pointer"
                          />
                        </span>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      {showConfirmInput && (
                        <>
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="confirmPassword"
                          >
                            Confirm Password
                          </label>
                          <div className="relative">
                            <span className="absolute left-4.5 top-3.5">
                              <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type={showPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              id="confirmPassword"
                              placeholder="Please confirm new password"
                              value={userProfile.confirmPassword}
                              onChange={(e) => {
                                handleInputChange(e);
                              }}
                            />
                            <span className="absolute right-4.5 top-3.5">
                              <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={handlePasswordToggle}
                                className="cursor-pointer"
                              />
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="button"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;