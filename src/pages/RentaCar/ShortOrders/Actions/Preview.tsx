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
    selectedSource: string;

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
    selectedSource: "",

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

const PreviewRentShort = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const [formOptions, setFormOptions] = useState<FormData | null>(null);
    const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

    const fetchData = async () => {
        try {
            const response = await fetch('http://85.190.242.108:4483/api/RentCar/Short/Create', {
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
            const response = await fetch(`http://85.190.242.108:4483/api/RentCar/Short/Edit?id=${ActionID}`, {
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
        selectedSource,

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
        console.log("Rentacar short orders add form values:", selectedData);
    }, [selectedData])

    // Vehicles list

    const getVehicleList = async () => {
        if (!!selectedVehicleGroup && !!startDateTime && !!endDateTime) {
            await fetch(`http://85.190.242.108:4483/api/RentCar/Long/GetVehicles?vehicleGroup=${selectedVehicleGroup}&isOutsourceVehicle=${selectedOutsourceVehicle}&isAllVehiclesSelected=${isAllVehiclesSelected}&startDate=${startDateTime}&endDate=${endDateTime}`, {
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
    }, [selectedVehicleGroup, selectedOutsourceVehicle, isAllVehiclesSelected, startDateTime, endDateTime]);

    const handleCheckboxChange = (value: boolean) => {
        setSelectedData((prevState) => ({
          ...prevState,
          isAllVehiclesSelected: value,
        }));
    };


    // Form options 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://85.190.242.108:4483/api/RentCar/Short/Create', {
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


    const handleBack = () => {
        navigate("/car/short-orders")
    };


    return (
        <DefaultLayout>
            <Breadcrumb pageName={`Preview / ${cardNumber}`} prevPageName='Rent short orders' prevRoute='/car/short-orders' />
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
                                                disabled
                                                type="text"
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
                                        <SelectGroupOne text="Service Type" options={[{ value: "M-000089", text: "Rent a Car Short" }]} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedServiceType} />
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Driver
                                            </label>
                                            <input
                                                disabled
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
                                            <SelectGroupOne text="Supplier" options={formOptions.suppliers || []} setSelectedData={setSelectedData} disabled={!formOptions.suppliers} defaultValue={selectedSupplier} />
                                            <SelectGroupOne text="Supplier Payment Method" options={formOptions.supplierPaymentMethods || []} setSelectedData={setSelectedData} disabled={!formOptions.supplierPaymentMethods} defaultValue={selectedSupplierPaymentMethod} />
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
                                                disabled
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
                                        <SelectGroupOne text="Source" options={formOptions.sources} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedSource} />
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
                                                disabled
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

export default PreviewRentShort;