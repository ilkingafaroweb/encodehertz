import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../../layout/DefaultLayout';
import MultiSelect from '../../../../components/Forms/MultiSelect';
import Swal from 'sweetalert2';
import DatePickerTwo from '../../../../components/Forms/DatePicker/DatePickerTwo';

interface FormData {
  address: string;
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

  serviceTypeDetails: { value: string; text: string }[];
  selectedServiceTypeDetail: string | null;

  sources: { value: string; text: string }[];
  selectedSource: string | null;
  priceToCustomer: number;
  customerPaymentMethods: { value: string; text: string }[];
  selectedCustomerPaymentMethod: string | null;
  customerName: string;
  requestedPerson: string;
  vehicleClasses: { value: string; text: string }[];
  selectedVehicleClass: string | null;
  vehicles: [] | null;
  selectedVehicle: string | null;
  isAllVehiclesSelected: boolean;
  priceToSupplier: number;
  supplierPaymentMethods: { value: string; text: string }[];
  selectedSupplierPaymentMethod: string | null;
  extraChargePanel: any[];
  drivers: { value: string; text: string }[];
  selectedDriver: string | null;
}

interface SelectedData {
  cardNumber: string;
  address: string;
  selectedContract: string;
  selectedSupplier: string;
  selectedSupplierContract: string;
  selectedCustomer: string;
  selectedServiceType: string;

  selectedServiceTypeDetail: string;

  selectedSource: string;
  selectedCustomerPaymentMethod: string;
  selectedOutsourceVehicle: boolean | string;
  selectedVehicleClass: string;
  selectedVehicle: string;
  isAllVehiclesSelected: boolean;
  selectedSupplierPaymentMethod: string;
  selectedDriver: string;

  priceToCustomer: number | "";
  priceToSupplier: number | "";

  startDateTime: string;
  endDateTime: string;

  customerName: string;
  requestedPerson: string;
  comment: string;

  extraChargePanel: [];
  selectedExtraCharges: []
}

const initialSelectedData: SelectedData = {
  cardNumber: '',
  address: '',
  selectedContract: "",
  selectedSupplier: "",
  selectedSupplierContract: "",
  selectedCustomer: "",
  selectedServiceType: "",

  selectedServiceTypeDetail: "",

  selectedSource: "",
  selectedCustomerPaymentMethod: "",
  selectedOutsourceVehicle: '',
  selectedVehicleClass: "",
  selectedVehicle: "",
  isAllVehiclesSelected: false,
  selectedSupplierPaymentMethod: "",
  selectedDriver: "",

  priceToCustomer: 0,
  priceToSupplier: 0,

  startDateTime: "",
  endDateTime: "",

  customerName: '',
  requestedPerson: "",
  comment: "",

  extraChargePanel: [],
  selectedExtraCharges: []
};

const PreviewBusShort = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [formOptions, setFormOptions] = useState<FormData | null>(null);
  const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

  const fetchData = async () => {
    try {
      const response = await fetch('https://encodehertz.xyz/api/Short/Create', {
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
      const response = await fetch(`https://encodehertz.xyz/api/Short/Edit?id=${ActionID}`, {
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
      console.log("Edit form data : ", selectedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getData = async () => {
    await fetchData();
    getPreview();
  };

  useEffect(() => {
    getData();
  }, [])

  const {
    cardNumber,
    address,
    selectedContract,
    selectedSupplier,
    selectedSupplierContract,
    selectedCustomer,
    selectedServiceType,

    selectedServiceTypeDetail,

    selectedSource,
    selectedCustomerPaymentMethod,
    selectedOutsourceVehicle,
    selectedVehicleClass,
    selectedVehicle,
    isAllVehiclesSelected,
    selectedDriver,
    selectedSupplierPaymentMethod,

    priceToCustomer,
    priceToSupplier,

    startDateTime,
    endDateTime,

    customerName,
    requestedPerson,
    comment,

    extraChargePanel,
    selectedExtraCharges
  } = selectedData

  // Vehicles list

  const getVehicleList = async () => {
    if (!!selectedVehicleClass && !!startDateTime && !!endDateTime) {
      await fetch(`https://encodehertz.xyz/api/Short/GetVehicles?vehicleClass=${selectedVehicleClass}&isOutsourceVehicle=${selectedOutsourceVehicle}&isAllVehiclesSelected=${isAllVehiclesSelected}&startDate=${startDateTime}&endDate=${endDateTime}`, {
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

  useEffect(() => {
    if (selectedServiceType) {
        fetch(`https://encodehertz.xyz/api/Short/GetServiceTypeDetails?selectedServiceType=${selectedServiceType}`, {
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
                    serviceTypeDetails: data
                }));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
}, [selectedServiceType]);


  const handleBack = () => {
    navigate("/bus/short-orders")
  };

  // Extra Charges 

  useEffect(() => {
    if (selectedCustomer && selectedVehicleClass) {
      fetch(`https://encodehertz.xyz/api/Short/GetExtraCharges?customerCode=${selectedCustomer}&vehicleClass=${selectedVehicleClass}`, {
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
    } else {
      console.error('FRONTDA PROBLEM VAR');
    }
  }, [selectedVehicleClass]);

  // Special extra charge for the customer

  useEffect(() => {
    if (selectedCustomer && selectedVehicleClass) {
      fetch(`https://encodehertz.xyz/api/Short/GetExtraCharges?customerCode=${selectedCustomer}&vehicleClass=${selectedVehicleClass}`, {
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
    } else {
      console.error('FRONTDA PROBLEM VAR');
    }

  }, [selectedCustomer]);


  useEffect(() => {
    if (selectedCustomer) {
      fetch(`https://encodehertz.xyz/api/Short/GetContracts?customerCode=${selectedCustomer}`, {
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
      fetch(`https://encodehertz.xyz/api/Short/GetSupplierContracts?supplierCode=${selectedSupplier}`, {
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
      <Breadcrumb pageName={`Preview / ${cardNumber}`} prevPageName='Bus short orders' prevRoute='/bus/short-orders' />
      {formOptions ? (
        <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <form>
                <div className="p-6.5">
                  <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                    <SelectGroupOne text="Customer" options={formOptions.customers || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedCustomer} />
                    <SelectGroupOne text="Contract" options={formOptions.contracts || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedContract} />
                    <div className="w-full xl:w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter customer name"
                        disabled={true}
                        value={customerName}
                        onChange={(e) => setSelectedData(prevData => ({
                          ...prevData,
                          customerName: e.target.value
                        }))}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <DatePickerTwo labelName="Start Date Time" disabled={true} setSelectedData={setSelectedData} value={startDateTime} />
                    <DatePickerTwo labelName="End Date Time" disabled={true} setSelectedData={setSelectedData} value={endDateTime} />
                  </div>

                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <SelectGroupOne text="Service Type" options={formOptions.serviceTypes || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedServiceType} />
                    <SelectGroupOne text="Service Type Detail" options={formOptions.serviceTypeDetails || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedServiceTypeDetail} />
                    <SelectGroupOne text="Driver" options={formOptions.drivers || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedDriver} />
                  </div>

                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <SelectGroupOne text="Source" options={formOptions.sources || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedSource} />
                    <div className="w-full xl:w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter address"
                        disabled={true}
                        value={address}
                        onChange={(e) => setSelectedData(prevData => ({
                          ...prevData,
                          address: e.target.value
                        }))}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  {
                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                      <SelectGroupOne text="Outsource Vehicle" options={[{ value: "true", text: "Outsource" }, { value: '', text: "Internal" }]} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedOutsourceVehicle ? "true" : ""} />
                      <SelectGroupOne text="Vehicle Class" options={formOptions.vehicleClasses || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedVehicleClass} />
                      <SelectGroupOne text="Vehicle" options={formOptions.vehicles || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedVehicle} />
                    </div>
                  }

                  <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                    <SelectGroupOne text="Customer Payment Method" options={formOptions.customerPaymentMethods || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedCustomerPaymentMethod} />
                    <div className="w-full xl:w-full">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Price To Customer
                      </label>
                      <input
                        type='number'
                        disabled={true}
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
                            type="number"
                            disabled={true}
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
                        disabled={true}
                        value={requestedPerson}
                        placeholder="Enter person name"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className='w-full'>

                    </div>
                  </div>

                  {
                    formOptions?.extraChargePanel?.length !== 0 && <div className='mb-6 flex flex-col gap-3'>
                      <label className="mt-3 block text-md font-medium text-black dark:text-white">
                        Extra Charge Panel
                      </label>
                      <MultiSelect ecpOptions={formOptions.extraChargePanel || []} setSelectedData={setSelectedData} disabled={true} defaultValue={extraChargePanel} outsource={selectedOutsourceVehicle} />
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
                        value={comment}
                        disabled={true}
                        placeholder="Type your comment"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      ></textarea>
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <button type='button' onClick={handleBack} className="flex w-full justify-center rounded bg-meta-1 p-3 font-medium text-gray hover:bg-opacity-90">
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

export default PreviewBusShort;