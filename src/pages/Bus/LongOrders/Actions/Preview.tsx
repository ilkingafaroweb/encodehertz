import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../../layout/DefaultLayout';
import DatePickerOne from '../../../../components/Forms/DatePicker/DatePickerOne';
import MultiSelect from '../../../../components/Forms/MultiSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

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
  priceToCustomerMonthly: number;
  customerPaymentMethods: { value: string; text: string }[];
  selectedCustomerPaymentMethod: string | null;
  requestedPerson: string;
  vehicleClasses: { value: string; text: string }[];
  selectedVehicleClass: string | null;
  vehicles: [] | null;
  selectedVehicle: string | null;
  priceToSupplierPaymentMonthly: number;
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

  priceToCustomerMonthly: number | "";
  priceToOutsourceMonthly: number | "";

  startDateTime: string;
  endDateTime: string;

  requestedPerson: string;
  comment: string;

  extraChargePanel: []
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

  priceToCustomerMonthly: 0,
  priceToOutsourceMonthly: 0,

  startDateTime: "",
  endDateTime: "",

  requestedPerson: "",
  comment: "",

  extraChargePanel: []
};

const PreviewBusLong = () => {
  const [showExtraCharge, setShowExtraCharge] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [formOptions, setFormOptions] = useState<FormData | null>(null);
  const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

  const fetchData = async () => {
    try {
      const response = await fetch('https://encodehertz.xyz/api/Long/Create',{
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

  const getPreview = async () => {
    try {
      const ActionID = await localStorage.getItem("ActionID")
      const response = await fetch(`https://encodehertz.xyz/api/Long/Edit?id=${ActionID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSelectedData(data as SelectedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getData = async () => {
    await fetchData()
    getPreview();
  };

  useEffect(() => {
    getData();
  }, [])

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

    priceToCustomerMonthly,
    priceToOutsourceMonthly,

    startDateTime,
    endDateTime,

    requestedPerson,
    comment,

    extraChargePanel
  } = selectedData

  useEffect(() => {
    console.log("BLO preview form valuessss:", extraChargePanel);
  }, [selectedData])

  //   Vehicles list

  useEffect(() => {
    if (!!selectedVehicleClass) {
      fetch(`https://encodehertz.xyz/api/Long/GetVehicles?vehicleClass=${selectedVehicleClass}&isOutsourceVehicle=${selectedOutsourceVehicle}`, {
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
  }, [selectedVehicleClass]);


  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You have unsaved changes!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, discard changes!',
      cancelButtonText: 'No, keep editing'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/bus/long-orders")
        console.log('Changes discarded');
      }
    });
  };

  const handleAdd = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to add this item?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Successfully added',
          '',
          'success'
        );
        console.log('Item added');
        navigate("/bus/long-orders")
      }
    });
  };

  // Datepicker default values

  const startDateDefault = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const endDateDefault = () => {
    const today = new Date();
    const nextDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const day = String(nextDate.getDate()).padStart(2, '0');
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const year = nextDate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (!!selectedCustomer) {
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
    if (!!selectedSupplier) {
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
    } else {
      console.error('FRONTDA PROBLEM VAR');
    }

  }, [selectedSupplier]);



  return (
    <DefaultLayout>
      <Breadcrumb pageName="Preview" prevPageName='Bus long orders' prevRoute='/bus/long-orders' />
      {formOptions ? (
        <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

              <form>
                <div className="p-6.5">
                  <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                    <SelectGroupOne text="Service Type" options={formOptions.serviceTypes || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedServiceType} />
                    <SelectGroupOne text="Customer" options={formOptions.customers || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedCustomer} />
                  </div>

                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <DatePickerOne labelName="Start Date Time" disabled={true} setSelectedData={setSelectedData} value={startDateTime} />
                    <DatePickerOne labelName="End Date Time" disabled={true} setSelectedData={setSelectedData} value={endDateTime} />
                  </div>

                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <SelectGroupOne text="Contract" options={formOptions.contracts || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedContract} />
                    <SelectGroupOne text="Driver" options={formOptions.drivers || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedDriver} />
                  </div>

                  {
                    selectedServiceType === "M-000003" && <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                      <SelectGroupOne text="Outsource Vehicle" options={[{ value: "true", text: "Outsource" }, { value: '', text: "Internal" }]} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedOutsourceVehicle ? "true" : ""} />
                      <SelectGroupOne text="Vehicle Class" options={formOptions.vehicleClasses || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedVehicleClass} />
                      <SelectGroupOne text="Vehicle" options={formOptions?.vehicles || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedVehicle} />
                    </div>
                  }

                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <SelectGroupOne text="Customer Payment Method" options={formOptions.customerPaymentMethods || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedCustomerPaymentMethod} />
                    <div className="w-full xl:w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Price To Costumer Monthly
                      </label>
                      <input
                        disabled
                        value={priceToCustomerMonthly}
                        placeholder='Empty'
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  {
                    selectedOutsourceVehicle && <> <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                      <SelectGroupOne text="Supplier" options={formOptions.suppliers || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedSupplier} />
                      <SelectGroupOne text="Supplier Contract" options={formOptions.supplierContracts || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedSupplierContract} />
                    </div>

                      <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                        <SelectGroupOne text="Supplier Payment Method" options={formOptions.supplierPaymentMethods || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedSupplierPaymentMethod} />
                        <div className="w-full xl:w-full">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Price To Outsource Monthly
                          </label>
                          <input
                            type='text'
                            disabled={true}
                            value={priceToOutsourceMonthly}
                            placeholder='Empty'
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
                        type='text'
                        disabled={true}
                        value={requestedPerson}
                        placeholder="Empty"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className='w-full'>

                    </div>
                  </div>

                  {/* <div className='mb-3 w-full flex justify-start items-end gap-3'>
                    <button
                      type='button'
                    //   onClick={() => setShowExtraCharge(!showExtraCharge)}
                      className='flex w-12 h-12 justify-center items-center rounded bg-white border border-stroke dark:bg-boxdark-2 p-3 font-medium dark:border-form-strokedark dark:text-gray hover:bg-opacity-90'>
                      {showExtraCharge ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
                    </button>
                    <label className="mb-3 block text-md font-medium text-black dark:text-white">
                      Extra Charge Panel
                    </label>

                  </div> */}
                  {
                    extraChargePanel.length !== 0 && <div className='mb-6 flex flex-col gap-3'>
                      <label className="mt-3 block text-md font-medium text-black dark:text-white">
                        Extra Charge Panel
                      </label>
                      <MultiSelect ecpOptions={formOptions.extraChargePanel || []} setSelectedData={setSelectedData} disabled={true} defaultValue={extraChargePanel} />
                    </div>
                  }

                  <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                    <div className='w-full'>
                      <label className="mb-2.5 block text-black dark:text-white">
                        Comment
                      </label>
                      <textarea
                        rows={2}
                        disabled={true}
                        value={comment}
                        placeholder="Empty"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      ></textarea>
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <button type='button' onClick={handleCancel} className="flex w-full justify-center rounded bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
                      Back
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

export default PreviewBusLong;