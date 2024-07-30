import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../../layout/DefaultLayout';
import DatePickerOne from '../../../../components/Forms/DatePicker/DatePickerOne';
import MultiSelect from '../../../../components/Forms/MultiSelect';
import Swal from 'sweetalert2';
import FormCheckbox from '../../../../components/Forms/Checkbox/FormCheckbox';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  cardNumber: string | null;
  contracts: { value: string; text: string }[];
  selectedContract: string | null;
  supplierContracts: { value: string; text: string }[];
  selectedSupplierContract: string | null;
  customers: { value: string; text: string }[];
  selectedCustomer: string | null;
  suppliers: { value: string; text: string }[];
  startDateTime: string;
  endDateTime: string;
  serviceTypes: { value: string; text: string }[];
  selectedServiceType: string | null;
  sources: { value: string; text: string }[];
  selectedSource: string | null;
  priceToCustomer: number;
  customerPaymentMethods: { value: string; text: string }[];
  selectedCustomerPaymentMethod: string | null;
  requestedPerson: string;
  vehicleClasses: { value: string; text: string }[];
  selectedVehicleClass: string | null;
  vehicles: [] | null;
  isAllVehiclesSelected: boolean;
  selectedVehicle: string | null;
  priceToSupplier: number;
  supplierPaymentMethods: { value: string; text: string }[];
  selectedSupplierPaymentMethod: string | null;
  extraChargePanel: any[];
  drivers: { value: string; text: string }[];
  selectedDriver: string | null;
}

interface SelectedData {
  selectedContract: string;
  selectedSupplier: string;
  selectedSupplierContract: string;
  selectedCustomer: string;
  selectedServiceType: string;
  selectedCustomerPaymentMethod: string;
  selectedOutsourceVehicle: string | boolean;
  selectedVehicleClass: string;
  selectedVehicle: string;
  selectedSupplierPaymentMethod: string;
  selectedDriver: string;

  priceToCustomer: number | "";
  priceToSupplier: number | "";

  startDateTime: string;
  endDateTime: string;

  requestedPerson: string;
  comment: string;

  isAllVehiclesSelected: boolean;

  extraChargePanel: [];
  selectedExtraCharges: []
}

const initialSelectedData: SelectedData = {
  selectedContract: "",
  selectedSupplier: "",
  selectedSupplierContract: "",
  selectedCustomer: "",
  selectedServiceType: "",
  selectedCustomerPaymentMethod: "",
  selectedOutsourceVehicle: "",
  selectedVehicleClass: "",
  selectedVehicle: "",
  selectedSupplierPaymentMethod: "",
  selectedDriver: "",

  priceToCustomer: 0,
  priceToSupplier: 0,

  startDateTime: "",
  endDateTime: "",

  requestedPerson: "",
  comment: "",

  isAllVehiclesSelected: false,

  extraChargePanel: [],
  selectedExtraCharges: []
};

const AddBusLong = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [formOptions, setFormOptions] = useState<FormData | null>(null);
  const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

  let timerInterval: any;
  let timeoutId: any;
  let remainingTime: number | null = null;

  const {
    selectedContract,
    selectedSupplier,
    selectedSupplierContract,
    selectedCustomer,
    selectedServiceType,
    selectedCustomerPaymentMethod,
    selectedOutsourceVehicle,
    selectedVehicleClass,
    selectedVehicle,
    selectedDriver,
    selectedSupplierPaymentMethod,

    priceToCustomer,
    priceToSupplier,

    startDateTime,
    endDateTime,

    requestedPerson,
    comment,

    isAllVehiclesSelected,

    extraChargePanel,
    selectedExtraCharges
  } = selectedData

  const validateForm = (): boolean => {
    const requiredFields = [
      { value: selectedCustomer, label: "Customer" },
      { value: selectedServiceType, label: "Service Type" },
      { value: startDateTime, label: "Start Date Time" },
      { value: endDateTime, label: "End Date Time" },
      { value: selectedDriver, label: "Driver" },
      { value: requestedPerson, label: "Requested Person" },
      { value: selectedVehicleClass, label: "Vehicle Class" },
      { value: selectedVehicle, label: "Vehicle" },
      // { value: selectedSupplier, label: "Supplier" },
    ];
  
    const invalidFields = requiredFields.filter(field => !field.value);
  
    if (invalidFields.length > 0) {
      const missingFields = invalidFields.map(field => field.label).join(', ');

  
      Swal.fire({
        icon: 'warning',
        title: 'The following fields are required:',
        text: `${missingFields}`,
        timerProgressBar: false,
        showConfirmButton: true, // OK butonunu gizle
        // didOpen: (toast) => {
        //   // İlk başta kalan süreyi almak
        //   remainingTime = Swal.getTimerLeft();
    
        //   toast.addEventListener('mouseover', () => {
        //     if (remainingTime !== null) {
        //       clearTimeout(timeoutId); // Hover edilince zamanlayıcıyı durdur
        //       Swal.stopTimer(); // Timer'ı durdur
        //     }
        //   });
    
        //   toast.addEventListener('mouseout', () => {
        //     if (remainingTime !== null) {
        //       Swal.resumeTimer(); // Timer'ı yeniden başlat
        //       timeoutId = setTimeout(() => {
        //         Swal.fire({
        //           icon: 'warning',
        //           title: 'The following fields are required:',
        //           text: `${missingFields}`,
        //           timer: remainingTime, // Kaldığı yerden devam et
        //           timerProgressBar: true,
        //           showConfirmButton: false,
        //           customClass: {
        //             container: 'my-toast-container'
        //           }
        //         });
        //       }, 100); // Bu kısa gecikme, hover ile hemen bir etki sağlamayı amaçlar
        //     }
        //   });
        // },
        // willClose: () => {
        //   clearInterval(timerInterval); // Toast kapandığında zamanlayıcıyı temizle
        //   clearTimeout(timeoutId); // Timeout'u temizle
        //   remainingTime = null; // Kalan süreyi sıfırla
        // },
        // customClass: {
        //   container: 'my-toast-container'
        // }
      });

      // toast.warning(
      //   `The following fields are required: ${missingFields}`,
      //   {
      //     position: "top-center",
      //     autoClose: 3000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     style: {
      //       backgroundColor: '#fff4e6', 
      //       color: '#ff6f61', 
      //       border: '1px solid #ffebd9', 
      //       borderRadius: '8px', 
      //       padding: '12px 24px', 
      //       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
      //       fontSize: '16px', 
      //       fontWeight: '500', 
      //     },
      //     icon: false 
      //   }
      // );
  
      // Add red border effect to invalid fields
      // invalidFields.forEach(field => {
      //   document.querySelector(`[name="${field.label}"]`)?.classList.add('border-red-500');
      //   setTimeout(() => {
      //     document.querySelector(`[name="${field.label}"]`)?.classList.remove('border-red-500');
      //   }, 5000);
      // });
  
      return false;
    }
  
    return true;
  };

  useEffect(() => {
    console.clear();
    console.log('SELECTED DATA -->', selectedData);
  }, [selectedData])

  useEffect(() => {
    const outsourceVehicleBoolean = !!selectedOutsourceVehicle;
    setSelectedData(prevData => ({
      ...prevData,
      selectedOutsourceVehicle: outsourceVehicleBoolean
    }));
  }, [selectedOutsourceVehicle]);

  useEffect(() => {
    if (!priceToCustomer) {
      setSelectedData(prevData => ({
        ...prevData,
        priceToCustomer: 0
      }));
    }
  }, [priceToCustomer])

  useEffect(() => {
    if (!priceToSupplier) {
      setSelectedData(prevData => ({
        ...prevData,
        priceToSupplier: 0
      }));
    }
  }, [priceToSupplier])

  // Bus long order post 

  const addBusLong = async () => {
    if (!validateForm()) return;

    await fetch('https://encodehertz.xyz/api/Long/Create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedData),
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
        text: data,
      });
      navigate('/bus/long-orders');
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    });
  };

  // Customer monthly payment default

  const getCustomerMonthlyPayment = async () => {
    if (!!selectedServiceType && !!selectedCustomer) {
      let apiUrl = `https://encodehertz.xyz/api/Long/GetCustomerMonthlyPayment?selectedCustomer=${selectedCustomer}&selectedServiceType=${selectedServiceType}`;

      if (!!selectedVehicleClass) {
        apiUrl = `https://encodehertz.xyz/api/Long/GetCustomerMonthlyPaymentCWD?selectedCustomer=${selectedCustomer}&selectedVehicleClass=${selectedVehicleClass}&selectedServiceType=${selectedServiceType}`;
      }

      await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setSelectedData(prevData => ({
            ...prevData,
            priceToCustomer: data
          }));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }

  useEffect(() => {
    getCustomerMonthlyPayment()
  }, [selectedServiceType, selectedCustomer, selectedVehicleClass]);


  // Outsource monthly payment default

  const getSupplierMonthlyPayment = async () => {
    if (!!selectedServiceType && !!selectedSupplier) {
      let apiUrl = `https://encodehertz.xyz/api/Long/GetSupplierMonthlyPayment?selectedSupplier=${selectedSupplier}&selectedServiceType=${selectedServiceType}`;

      if (!!selectedVehicleClass) {
        apiUrl = `https://encodehertz.xyz/api/Long/GetSupplierMonthlyPaymentCWD?selectedSupplier=${selectedSupplier}&selectedVehicleClass=${selectedVehicleClass}&selectedServiceType=${selectedServiceType}`;
      }

      await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setSelectedData(prevData => ({
            ...prevData,
            priceToSupplier: data
          }));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }

  useEffect(() => {
    getSupplierMonthlyPayment()
  }, [selectedServiceType, selectedSupplier, selectedVehicleClass]);

  // Vehicles list

  const getVehicleList = async () => {
    if (!!selectedVehicleClass && !!startDateTime && !!endDateTime) {
      await fetch(`https://encodehertz.xyz/api/Long/GetVehicles?vehicleClass=${selectedVehicleClass}&isOutsourceVehicle=${selectedOutsourceVehicle}&isAllVehiclesSelected=${isAllVehiclesSelected}&startDate=${startDateTime}&endDate=${endDateTime}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setFormOptions(prevData => ({
            ...prevData,
            vehicles: data
          }));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }

  useEffect(() => {
    getVehicleList()
  }, [selectedVehicleClass, selectedOutsourceVehicle, isAllVehiclesSelected, startDateTime, endDateTime]);

  const handleCheckboxChange = (value: boolean) => {
    setSelectedData((prevState) => ({
      ...prevState,
      isAllVehiclesSelected: value,
    }));
  };


  // Extra charges

  const getExtraCharges = async () => {
    setFormOptions(prevData => ({
      ...prevData,
      extraChargePanel: []
    }));
    if (selectedCustomer && selectedVehicleClass) {
      await fetch(`https://encodehertz.xyz/api/Long/GetExtraCharges?customerCode=${selectedCustomer}&vehicleClass=${selectedVehicleClass}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setFormOptions(prevData => ({
            ...prevData,
            extraChargePanel: data
          }));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }

  useEffect(() => {
    getExtraCharges()
  }, [selectedCustomer, selectedVehicleClass])


  // Form options 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://encodehertz.xyz/api/Long/Create', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFormOptions(data as FormData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You have unsaved insert!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, discard insert!',
      cancelButtonText: 'No, keep inserting'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/bus/long-orders")
      }
    });
  };

  useEffect(() => {
    if (selectedCustomer) {
      fetch(`https://encodehertz.xyz/api/Long/GetContracts?customerCode=${selectedCustomer}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setFormOptions(prevData => ({
            ...prevData,
            contracts: data
          }));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    } else {
      console.error('FRONTDA PROBLEM VAR');
    }

  }, [selectedCustomer]);


  useEffect(() => {
    if (selectedSupplier) {
      fetch(`https://encodehertz.xyz/api/Long/GetSupplierContracts?supplierCode=${selectedSupplier}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setFormOptions(prevData => ({
            ...prevData,
            supplierContracts: data
          }));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [selectedSupplier]);

  return (
    <DefaultLayout>
      <ToastContainer />
      <Breadcrumb pageName="Insert" prevPageName='Bus long orders' prevRoute='/bus/long-orders' />
      {formOptions ? (
        <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

              <form>
                <div className="p-6.5">
                  <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                    <SelectGroupOne text="Customer" options={formOptions.customers || []} setSelectedData={setSelectedData} disabled={false} defaultValue={selectedData.selectedCustomer} />
                    <SelectGroupOne text="Service Type" options={formOptions.serviceTypes || []} setSelectedData={setSelectedData} disabled={false} defaultValue={selectedData.selectedServiceType} />
                  </div>

                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <DatePickerOne labelName="Start Date Time" disabled={false} setSelectedData={setSelectedData} value={startDateTime} />
                    <DatePickerOne labelName="End Date Time" disabled={false} setSelectedData={setSelectedData} value={endDateTime} />
                  </div>

                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <SelectGroupOne text="Contract" options={formOptions.contracts || []} setSelectedData={setSelectedData} disabled={false} defaultValue={selectedData.selectedContract} />
                    <SelectGroupOne text="Driver" options={formOptions.drivers || []} setSelectedData={setSelectedData} disabled={false} defaultValue={selectedData.selectedDriver} />
                  </div>

                  {
                    selectedData.selectedServiceType === "M-000003" && <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                      <SelectGroupOne text="Outsource Vehicle" options={[{ value: "true", text: "Outsource" }, { value: '', text: "Internal" }]} setSelectedData={setSelectedData} disabled={false} defaultValue="" />
                      <SelectGroupOne text="Vehicle Class" options={formOptions.vehicleClasses || []} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                      <FormCheckbox label="Show all vehicles" value={isAllVehiclesSelected} set={handleCheckboxChange} disabled={false} />
                      <SelectGroupOne text="Vehicle" options={formOptions.vehicles || []} setSelectedData={setSelectedData} disabled={formOptions.vehicles ? false : true} defaultValue='' />
                    </div>
                  }

                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <SelectGroupOne text="Customer Payment Method" options={formOptions.customerPaymentMethods || []} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                    <div className="w-full xl:w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Price To Customer
                      </label>
                      <input
                        type='number'
                        disabled={false}
                        value={priceToCustomer !== 0 ? priceToCustomer : 0}
                        placeholder='Empty'
                        onChange={(e) => {
                          let newValue = e.target.value;
                          newValue = newValue.replace(/^0+(?=\d)/, '');
                          const parsedValue = parseFloat(newValue);
                          setSelectedData(prevData => ({
                            ...prevData,
                            priceToCustomer: !isNaN(parsedValue) ? parsedValue : ''
                          }));
                        }}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  {
                    selectedData.selectedOutsourceVehicle == true && <> <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                      <SelectGroupOne text="Supplier" options={formOptions.suppliers || []} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                      <SelectGroupOne text="Supplier Contract" options={formOptions.supplierContracts || []} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                    </div>

                      <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                        <SelectGroupOne text="Supplier Payment Method" options={formOptions.supplierPaymentMethods || []} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                        <div className="w-full xl:w-full">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Price To Supplier
                          </label>
                          <input
                            type="number"
                            disabled={false}
                            placeholder="Empty"
                            value={priceToSupplier}
                            onChange={(e) => {
                              const newValue = parseFloat(e.target.value);
                              setSelectedData(prevData => ({
                                ...prevData,
                                priceToSupplier: newValue
                              }))
                            }}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                        </div>
                      </div></>
                  }
                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <div className="w-full xl:w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Requested Person
                      </label>
                      <input
                        onChange={(e) => setSelectedData(prevData => ({
                          ...prevData,
                          requestedPerson: e.target.value
                        }))}
                        type="text"
                        placeholder="Enter person name"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className='w-full'>

                    </div>
                  </div>
                  {
                    formOptions.extraChargePanel.length !== 0 && <div className='mb-6 flex flex-col gap-3'>
                      <label className="mt-3 block text-md font-medium text-black dark:text-white">
                        Extra Charge Panel
                      </label>
                      <MultiSelect ecpOptions={formOptions.extraChargePanel || []} setSelectedData={setSelectedData} disabled={false} defaultValue={null} outsource={selectedOutsourceVehicle} />
                    </div>
                  }
                  <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                    <div className='w-full'>
                      <label className="mb-2.5 block text-black dark:text-white">
                        Comment
                      </label>
                      <textarea
                        onChange={(e) => setSelectedData(prevData => ({
                          ...prevData,
                          comment: e.target.value
                        }))}
                        rows={3}
                        placeholder="Type your comment"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      ></textarea>
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <button type='button' onClick={handleCancel} className="flex w-full justify-center rounded bg-danger dark:bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
                      Cancel
                    </button>
                    <button type='button' onClick={addBusLong} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                      Insert
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center h-96'>
          <p className='text-2xl'>The form is loading...</p>
        </div>
      )}
    </DefaultLayout>
  );
};

export default AddBusLong;