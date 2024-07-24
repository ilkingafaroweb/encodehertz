import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../../layout/DefaultLayout';
import MultiSelect from '../../../../components/Forms/MultiSelect';
import Swal from 'sweetalert2';
import DatePickerTwo from '../../../../components/Forms/DatePicker/DatePickerTwo';
import FormCheckbox from '../../../../components/Forms/Checkbox/FormCheckbox';

interface FormData {
    address: string;
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

const DuplicateBusShort = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [showAllVehicles, setShowAllVehicles] = useState(false)
    const [formOptions, setFormOptions] = useState<FormData | null>(null);
    const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

    useEffect(() => {
        console.log("Customer", selectedData);
    }, [selectedData])

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

    useEffect(() => {
        const outsourceVehicleBoolean = Boolean(selectedOutsourceVehicle);
        console.log("Outsource vehicle : ", outsourceVehicleBoolean);

        setSelectedData(prevData => {
            if (prevData.selectedOutsourceVehicle === outsourceVehicleBoolean) {
                return prevData;
            }
            return {
                ...prevData,
                selectedOutsourceVehicle: outsourceVehicleBoolean
            };
        });
    }, [selectedOutsourceVehicle]);

    useEffect(() => {
        console.clear()
        console.log("SELECTED DATA --->", selectedData);
    }, [selectedData])


    // Vehicles list

    const getVehicleList = async () => {
        if (!!selectedVehicleClass) {
            await fetch(`https://encodehertz.xyz/api/Short/GetVehicles?vehicleGroup=${selectedVehicleClass}&isOutsourceVehicle=${selectedOutsourceVehicle}&isAllVehiclesSelected=${isAllVehiclesSelected}`, {
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
    }, [selectedVehicleClass, selectedOutsourceVehicle, isAllVehiclesSelected]);

    const handleCheckboxChange = (value: boolean) => {
        setSelectedData((prevState) => ({
            ...prevState,
            isAllVehiclesSelected: value,
        }));
    };


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
                navigate("/bus/Short-orders")
                console.log('Changes discarded');
            }
        });
    };

    const addBusShort = async () => {
        await fetch('https://encodehertz.xyz/api/Short/Create', {
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
                navigate('/bus/short-orders')
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                });
            });
    }

    // Customer monthly payment default

    const getCustomerMonthlyPayment = async () => {
        if (selectedServiceType && selectedCustomer && selectedServiceTypeDetail && selectedVehicleClass) {
            let apiUrl = `https://encodehertz.xyz/api/Short/GetCustomerMonthlyPaymentCWD?selectedCustomer=${selectedCustomer}&selectedVehicleClass=${selectedVehicleClass}&selectedServiceType=${selectedServiceType}&selectedServiceTypeDetail=${selectedServiceTypeDetail}`;

            setSelectedData(prevData => ({
                ...prevData,
                priceToCustomer: 0
            }));

            await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
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
        return () => {
            getCustomerMonthlyPayment()
        }
    }, [selectedServiceType, selectedCustomer, selectedVehicleClass, selectedServiceTypeDetail]);

    // Outsource monthly payment default

    const getSupplierMonthlyPayment = async () => {
        if (selectedServiceType && selectedSupplier && selectedServiceTypeDetail && selectedVehicleClass) {
            let apiUrl = `https://encodehertz.xyz/api/Short/GetSupplierMonthlyPaymentCWD?selectedSupplier=${selectedSupplier}&selectedVehicleClass=${selectedVehicleClass}&selectedServiceType=${selectedServiceType}&selectedServiceTypeDetail=${selectedServiceTypeDetail}`;

            setSelectedData(prevData => ({
                ...prevData,
                priceToSupplier: 0
            }));

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
        return () => {
            getSupplierMonthlyPayment()
        }
    }, [selectedServiceType, selectedServiceTypeDetail, selectedSupplier, selectedVehicleClass]);


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
            <Breadcrumb pageName={`Duplicate`} prevPageName='Bus short orders' prevRoute='/bus/short-orders' />
            {formOptions ? (
                <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <form>
                                <div className="p-6.5">
                                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                        <SelectGroupOne text="Customer" options={formOptions.customers || []} setSelectedData={setSelectedData} disabled={!formOptions.customers} defaultValue={selectedCustomer} />
                                        <SelectGroupOne text="Contract" options={formOptions.contracts || []} setSelectedData={setSelectedData} disabled={!formOptions.contracts} defaultValue={selectedContract} />
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Customer Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter customer name"
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
                                        <DatePickerTwo labelName="Start Date Time" disabled={false} setSelectedData={setSelectedData} value={startDateTime} />
                                        <DatePickerTwo labelName="End Date Time" disabled={false} setSelectedData={setSelectedData} value={endDateTime} />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="Service Type" options={formOptions.serviceTypes || []} setSelectedData={setSelectedData} disabled={!formOptions.serviceTypes} defaultValue={selectedServiceType} />
                                        <SelectGroupOne text="Service Type Detail" options={formOptions.serviceTypeDetails || []} setSelectedData={setSelectedData} disabled={!formOptions.serviceTypeDetails} defaultValue={selectedServiceTypeDetail} />
                                        <SelectGroupOne text="Driver" options={formOptions.drivers || []} setSelectedData={setSelectedData} disabled={!formOptions.drivers} defaultValue={selectedDriver} />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="Source" options={formOptions.sources || []} setSelectedData={setSelectedData} disabled={!formOptions.sources} defaultValue={selectedSource} />
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter address"
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
                                            <SelectGroupOne text="Outsource Vehicle" options={[{ value: "true", text: "Outsource" }, { value: '', text: "Internal" }]} setSelectedData={setSelectedData} disabled={false} defaultValue={selectedOutsourceVehicle ? "true" : ""} />
                                            <SelectGroupOne text="Vehicle Class" options={formOptions.vehicleClasses || []} setSelectedData={setSelectedData} disabled={!formOptions.vehicleClasses} defaultValue={selectedVehicleClass} />
                                            <FormCheckbox label="Show all vehicles" value={isAllVehiclesSelected} set={handleCheckboxChange} disabled={false} />
                                            <SelectGroupOne text="Vehicle" options={formOptions.vehicles || []} setSelectedData={setSelectedData} disabled={!formOptions.vehicles} defaultValue={selectedVehicle} />
                                        </div>
                                    }

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="Customer Payment Method" options={formOptions.customerPaymentMethods || []} setSelectedData={setSelectedData} disabled={!formOptions.customerPaymentMethods} defaultValue={selectedCustomerPaymentMethod} />
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
                                            <SelectGroupOne text="Supplier" options={formOptions.suppliers || []} setSelectedData={setSelectedData} disabled={!formOptions.suppliers} defaultValue={selectedSupplier} />
                                            <SelectGroupOne text="Supplier Contract" options={formOptions.supplierContracts || []} setSelectedData={setSelectedData} disabled={!formOptions.supplierContracts} defaultValue={selectedSupplierContract} />
                                        </div>

                                            <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                                <SelectGroupOne text="Supplier Payment Method" options={formOptions.supplierPaymentMethods || []} setSelectedData={setSelectedData} disabled={!formOptions.supplierPaymentMethods} defaultValue={selectedSupplierPaymentMethod} />
                                                <div className="w-full xl:w-full">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Price To Outsource Monthly
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
                                                value={requestedPerson}
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
                                            <MultiSelect ecpOptions={formOptions.extraChargePanel || []} setSelectedData={setSelectedData} disabled={false} defaultValue={extraChargePanel} outsource={selectedOutsourceVehicle} />
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
                                                placeholder="Type your comment"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className='flex gap-3'>
                                        <button type='button' onClick={handleCancel} className="flex w-full justify-center rounded bg-meta-1 p-3 font-medium text-gray hover:bg-opacity-90">
                                            Cancel
                                        </button>
                                        <button type='button' onClick={addBusShort} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
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

export default DuplicateBusShort;