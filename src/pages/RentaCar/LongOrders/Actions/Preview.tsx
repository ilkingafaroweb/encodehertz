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
    cardNumber: string | null;
    customerName: string;
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
    vehicleGroups: { value: string; text: string }[];
    selectedVehicleGroup: string | null;
    // selectedVehicleClass: string | null;
    vehicles: [] | null;
    driver: string;
    selectedVehicle: string | null;
    priceToSupplier: number;
    supplierPaymentMethods: { value: string; text: string }[];
    selectedSupplierPaymentMethod: string | null;
    isAllVehiclesSelected: boolean;
    extraChargePanel: any[];
}

interface SelectedData {
    customerName: string;
    cardNumber: string;
    selectedContract: string;
    selectedSupplier: string;
    selectedSupplierContract: string;
    selectedCustomer: string;
    selectedServiceType: string;
    selectedCustomerPaymentMethod: string;
    selectedOutsourceVehicle: string | boolean;

    selectedVehicleGroup: string;
    // selectedVehicleClass: string;

    selectedVehicle: string;
    driver: string;
    selectedSupplierPaymentMethod: string;

    priceToCustomer: number;
    priceToSupplier: number;

    startDateTime: string;
    endDateTime: string;

    requestedPerson: string;
    comment: string;

    isAllVehiclesSelected: boolean;

    extraChargePanel: []
    selectedExtraCharges: []
}

const initialSelectedData: SelectedData = {
    customerName: "",
    cardNumber: "",
    selectedContract: "",
    selectedSupplier: "",
    selectedSupplierContract: "",
    selectedCustomer: "",
    selectedServiceType: "",
    selectedCustomerPaymentMethod: "",
    selectedOutsourceVehicle: "",
    selectedVehicleGroup: "",

    // selectedVehicleClass: "",

    selectedVehicle: "",
    selectedSupplierPaymentMethod: "",

    driver: '',

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

const PreviewRentLong = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const [formOptions, setFormOptions] = useState<FormData | null>(null);
    const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

    const fetchData = async () => {
        try {
            const response = await fetch('https://encodehertz.xyz/api/RentCar/Long/Create', {
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
            const response = await fetch(`https://encodehertz.xyz/api/RentCar/Long/Edit?id=${ActionID}`, {
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
        customerName,
        selectedContract,
        selectedSupplier,
        selectedSupplierContract,
        selectedCustomer,
        selectedServiceType,
        selectedCustomerPaymentMethod,
        selectedOutsourceVehicle,

        selectedVehicleGroup,
        // selectedVehicleClass,

        selectedVehicle,
        selectedSupplierPaymentMethod,

        priceToCustomer,
        priceToSupplier,

        driver,

        startDateTime,
        endDateTime,

        requestedPerson,
        comment,

        isAllVehiclesSelected,

        extraChargePanel,
        selectedExtraCharges
    } = selectedData

    // Form options 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://encodehertz.xyz/api/RentCar/Long/Create', {
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


    useEffect(() => {
        const outsourceVehicleBoolean = !!selectedOutsourceVehicle;
        console.log("Outsource vehicle : ", outsourceVehicleBoolean);
        setSelectedData(prevData => ({
            ...prevData,
            selectedOutsourceVehicle: outsourceVehicleBoolean
        }));
    }, [selectedOutsourceVehicle]);


    useEffect(() => {
        console.clear()
        console.log("Rentacar long orders add form values:", selectedData);
    }, [selectedData])

    // Vehicles list

    const getVehicleList = async () => {
        if (!!selectedVehicleGroup) {
            await fetch(`https://encodehertz.xyz/api/RentCar/Long/GetVehicles?vehicleGroup=${selectedVehicleGroup}&isOutsourceVehicle=${selectedOutsourceVehicle}&isAllVehiclesSelected=${isAllVehiclesSelected}`, {
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
    }, [selectedVehicleGroup, selectedOutsourceVehicle, isAllVehiclesSelected]);

    const handleCheckboxChange = (value: boolean) => {
        setSelectedData((prevState) => ({
          ...prevState,
          isAllVehiclesSelected: value,
        }));
    };


    // Extra charges

    const getExtraCharges = async () => {
        if (!!selectedCustomer && !!selectedVehicleGroup) {
            await fetch(`https://encodehertz.xyz/api/RentCar/Long/GetExtraCharges?customerCode=${selectedCustomer}&vehicleGroup=${selectedVehicleGroup}`, {
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
    }, [selectedCustomer, selectedVehicleGroup])


    const handleBack = () => {
        navigate("/car/long-orders")
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName={`Preview / ${cardNumber}`} prevPageName='Rent long orders' prevRoute='/car/long-orders' />
            {formOptions ? (
                <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <form>
                                <div className="p-6.5">
                                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                        <SelectGroupOne text="Customer" options={formOptions.customers || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedCustomer} />
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Customer Name
                                            </label>
                                            <input
                                                type="text"
                                                disabled={true}
                                                onChange={(e) => setSelectedData(prevData => ({
                                                    ...prevData,
                                                    customerName: e.target.value
                                                }))}
                                                value={customerName}
                                                placeholder="Enter customer name"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="Service Type" options={[{ value: "M-000089", text: "Rent a Car Long" }]} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedServiceType} />
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Driver
                                            </label>
                                            <input
                                                disabled={true}
                                                onChange={(e) => setSelectedData(prevData => ({
                                                    ...prevData,
                                                    driver: e.target.value
                                                }))}
                                                type="text"
                                                value={driver}
                                                placeholder="Enter driver name"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <DatePickerTwo labelName="Start Date Time" disabled={true} setSelectedData={setSelectedData} value={startDateTime} />
                                        <DatePickerTwo labelName="End Date Time" disabled={true} setSelectedData={setSelectedData} value={endDateTime} />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="Outsource Vehicle" options={[{ value: "true", text: "Outsource" }, { value: '', text: "Internal" }]} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedOutsourceVehicle ? "true" : ""} />
                                        <SelectGroupOne text="Vehicle Group" options={formOptions.vehicleGroups || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedVehicleGroup} />
                                        <FormCheckbox label="Show all vehicles" value={isAllVehiclesSelected} set={handleCheckboxChange}  disabled={true}/>
                                        <SelectGroupOne text="Vehicle" options={formOptions.vehicles || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedVehicle} />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="Customer Payment Method" options={formOptions.customerPaymentMethods || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedCustomerPaymentMethod} />
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Price To Costumer Monthly
                                            </label>
                                            <input
                                                type='number'
                                                disabled={true}
                                                value={priceToCustomer}
                                                placeholder='Empty'
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value);
                                                    setSelectedData(prevData => ({
                                                        ...prevData,
                                                        priceToCustomer: !isNaN(newValue) && newValue
                                                    }));
                                                }}
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    {
                                        selectedData.selectedOutsourceVehicle == true &&
                                        <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                            <SelectGroupOne text="Supplier" options={formOptions.suppliers || []} setSelectedData={setSelectedData} disabled={!formOptions.suppliers} defaultValue='' />
                                            <SelectGroupOne text="Supplier Payment Method" options={formOptions.supplierPaymentMethods || []} setSelectedData={setSelectedData} disabled={!formOptions.supplierPaymentMethods} defaultValue='' />
                                            <div className="w-full xl:w-full">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Price To Supplier
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
                                        </div>
                                    }
                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Requested Person
                                            </label>
                                            <input
                                                disabled={true}
                                                value={requestedPerson}
                                                onChange={(e) => setSelectedData(prevData => ({
                                                    ...prevData,
                                                    requestedPerson: e.target.value
                                                }))}
                                                type="text"
                                                placeholder="Enter person name"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                        <div className="w-full hidden xl:w-full xl:block">

                                        </div>
                                        {/* <SelectGroupOne text="Source" options={formOptions.sources} setSelectedData={setSelectedData} disabled={true} defaultValue='' /> */}
                                    </div>
                                    {
                                        formOptions.extraChargePanel?.length !== 0 && <div className='mb-6 flex flex-col gap-3'>
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
                                                disabled={true}
                                                value={comment}
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
                                        <button type='button' onClick={handleBack} className="flex w-full justify-center rounded bg-danger dark:bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
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

export default PreviewRentLong;