import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../../layout/DefaultLayout';
import MultiSelect from '../../../../components/Forms/MultiSelect';
import Swal from 'sweetalert2';
import DatePickerTwo from '../../../../components/Forms/DatePicker/DatePickerTwo';

interface FormData {
    cardNumber: string | null;
    contracts: { value: string; text: string }[];
    selectedContract: string | null;
    supplierContracts: { value: string; text: string }[];
    selectedSupplierContract: string | null;
    businessUnits: { value: string; text: string }[];
    selectedBusinessUnit: string | null;
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
    priceToOutsourcePaymentMonthly: number;
    supplierPaymentMethods: { value: string; text: string }[];
    selectedOutsourcePaymentMethod: string | null;
    extraChargePanel: any[];
    drivers: { value: string; text: string }[];
    selectedDriver: string | null;
}

interface SelectedData {
    selectedContract: string;
    selectedSupplier: string;
    selectedSupplierContract: string;
    selectedBusinessUnit: string;
    selectedCustomer: string;
    selectedServiceType: string;
    selectedSource: string;
    selectedCustomerPaymentMethod: string;
    selectedOutsourceVehicle: boolean | string;
    selectedVehicleClass: string;
    selectedVehicle: string;
    selectedOutsourcePaymentMethod: string;
    selectedDriver: string;

    priceToCustomerMonthly: number,
    priceToOutsourceMonthly: number,

    startDateTime: string;
    endDateTime: string;

    requestedPerson: string;
    comment: string;
}

const initialSelectedData: SelectedData = {

    selectedContract: "",
    selectedSupplier: "",
    selectedSupplierContract: "",
    selectedBusinessUnit: "",
    selectedCustomer: "",
    selectedServiceType: "",
    selectedSource: "",
    selectedCustomerPaymentMethod: "",
    selectedOutsourceVehicle: '',
    selectedVehicleClass: "",
    selectedVehicle: "",
    selectedOutsourcePaymentMethod: "",
    selectedDriver: "",

    priceToCustomerMonthly: 0,
    priceToOutsourceMonthly: 0,

    startDateTime: "",
    endDateTime: "",

    requestedPerson: "",
    comment: "",
};

const AddBusShort = () => {
    const token = localStorage.getItem('token')
    const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

    const {
        selectedContract,
        selectedSupplier,
        selectedSupplierContract,
        selectedBusinessUnit,
        selectedCustomer,
        selectedServiceType,
        selectedSource,
        selectedCustomerPaymentMethod,
        selectedOutsourceVehicle,
        selectedVehicleClass,
        selectedVehicle,
        selectedDriver,
        selectedOutsourcePaymentMethod,

        priceToCustomerMonthly,
        priceToOutsourceMonthly,

        startDateTime,
        endDateTime,

        requestedPerson,
        comment
    } = selectedData

    useEffect(() => {
        console.clear()
        console.log(selectedData);
    }, [selectedData])

    useEffect(() => {
        console.log("AAAAAA:", selectedData);
    }, [selectedData])

    useEffect(() => {
        const outsourceVehicleBoolean = !!selectedOutsourceVehicle;
        console.log("Outsource vehicle : ", outsourceVehicleBoolean);
        setSelectedData(prevData => ({
          ...prevData,
          selectedOutsourceVehicle: outsourceVehicleBoolean
        }));
      }, [selectedOutsourceVehicle]);


    // Customer monthly payment default

    useEffect(() => {
        if (selectedServiceType && selectedCustomer) {
            let apiUrl = `https://encodehertz.xyz/api/Long/GetCustomerMonthlyPayment?selectedCustomer=${selectedCustomer}&selectedServiceType=${selectedServiceType}`;

            if (selectedVehicleClass) {
                apiUrl = `https://encodehertz.xyz/api/Long/GetCustomerMonthlyPaymentCWD?selectedCustomer=${selectedCustomer}&selectedVehicleClass=${selectedVehicleClass}&selectedServiceType=${selectedServiceType}`;
            }

            fetch(apiUrl, {
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
                        customerMonthlyPayment: data
                    }));
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [selectedServiceType, selectedCustomer, selectedVehicleClass]);


    // Outsource monthly payment default

    useEffect(() => {
        if (selectedServiceType && selectedSupplier) {
            let apiUrl = `https://encodehertz.xyz/api/Long/GetSupplierMonthlyPayment?selectedSupplier=${selectedSupplier}&selectedServiceType=${selectedServiceType}`;

            if (selectedVehicleClass) {
                apiUrl = `https://encodehertz.xyz/api/Long/GetSupplierMonthlyPaymentCWD?selectedSupplier=${selectedSupplier}&selectedVehicleClass=${selectedVehicleClass}&selectedServiceType=${selectedServiceType}`;
            }

            fetch(apiUrl, {
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
                        supplierMonthlyPayment: data
                    }));
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [selectedServiceType, selectedSupplier, selectedVehicleClass]);

    // Vehicles list

    useEffect(() => {
        if (selectedVehicleClass) {
            fetch(`https://encodehertz.xyz/api/Long/GetVehicles?vehicleClass=${selectedVehicleClass}`, {
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


    const [showExtraCharge, setShowExtraCharge] = useState(false)
    const navigate = useNavigate()

    const [formOptions, setFormOptions] = useState<FormData | null>(null);

    // Form options 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://encodehertz.xyz/api/Long/Create', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
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
        console.log(formOptions);
    }, [formOptions])


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
                navigate("/bus/short-orders")
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



    return (
        <DefaultLayout>
            <Breadcrumb pageName="Insert" prevPageName='Bus short orders' prevRoute='/bus/short-orders' />
            {formOptions ? (
                <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                            <form>
                                <div className="p-6.5">
                                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                        <SelectGroupOne text="Customer" options={formOptions.customers || []} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Customer Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter customer name"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <DatePickerTwo text="Start Date Time" />
                                        <DatePickerTwo text="End Date Time" />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="Service Type" options={formOptions.serviceTypes || []} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                                        <SelectGroupOne text="Service Details" options={[{ value: 'A', text: 'A' }, { value: 'B', text: 'B' }, { value: 'C', text: 'C' }]} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                                        <SelectGroupOne text="Driver" options={formOptions.drivers || []} setSelectedData={setSelectedData} disabled={false} defaultValue=''/>
                                    </div>


                                    {/* <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="Hour Interval" options={[{value: "8", text : "8"},{value: "12", text : "12"},{value: "24", text : "24"},]} setSelectedData={setSelectedData} disabled={false} />
                                        <SelectGroupOne text="Tour Select" options={formOptions.serviceTypes || []} setSelectedData={setSelectedData} disabled={false} />
                                    </div>


                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="From Region" options={[{value: "Simal", text : "Simal"},{value: "Qerb", text : "Qerb"}]} setSelectedData={setSelectedData} disabled={false} />
                                        <SelectGroupOne text="To Region" options={[{value: "Aran", text : "Aran"},{value: "Cenub", text : "Cenub"}]} setSelectedData={setSelectedData} disabled={false} />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="From" options={[{value: "A", text : "A"},{value: "B", text : "B"},{value: "C", text : "C"},]} setSelectedData={setSelectedData} disabled={false} />
                                        <SelectGroupOne text="To" options={[{value: "A", text : "A"},{value: "B", text : "B"},{value: "C", text : "C"},]} setSelectedData={setSelectedData} disabled={false} />
                                    </div> */}

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="Source" options={[{ value: "Site", text: "Site" }, { value: "Advertise", text: "Advertise" }]} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter address"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {
                                        selectedData.selectedServiceType === "M-000003" && <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                            <SelectGroupOne text="Outsource Vehicle" options={[{ value: "true", text: "Outsource" }, { value: '', text: "Internal" }]} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                                            <SelectGroupOne text="Vehicle Class" options={formOptions.vehicleClasses || []} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                                            <SelectGroupOne text="Vehicle" options={formOptions.vehicles || []} setSelectedData={setSelectedData} disabled={formOptions.vehicles ? false : true} defaultValue='' />
                                        </div>
                                    }

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <SelectGroupOne text="Customer Payment Method" options={formOptions.customerPaymentMethods || []} setSelectedData={setSelectedData} disabled={false} defaultValue='' />
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Price To Costumer
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                inputMode='numeric'
                                                min={0}
                                                step="1"
                                                disabled={priceToCustomerMonthly != null ? false : true}
                                                value={priceToCustomerMonthly}
                                                onChange={(e) => setSelectedData(prevData => ({
                                                    ...prevData,
                                                    priceToCustomerMonthly: parseInt(e.target.value)
                                                }))}

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
                                                        Price To Outsource Monthly
                                                    </label>
                                                    <input
                                                        type="number"
                                                        disabled={false}
                                                        placeholder="Empty"
                                                        value={priceToOutsourceMonthly !== 0 ? priceToOutsourceMonthly : 0}
                                                        onChange={(e) => {
                                                            const newValue = parseFloat(e.target.value);
                                                            setSelectedData(prevData => ({
                                                                ...prevData,
                                                                priceToOutsourceMonthly: newValue
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

                                    {/* <div className='mb-3 w-full flex justify-start items-end gap-3'>
                                        <button
                                            type='button'
                                            onClick={() => setShowExtraCharge(!showExtraCharge)}
                                            className='flex w-12 h-12 justify-center items-center rounded bg-white border border-stroke dark:bg-boxdark-2 p-3 font-medium dark:border-form-strokedark dark:text-gray hover:bg-opacity-90'>
                                            {showExtraCharge ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
                                        </button>
                                        <label className="mb-3 block text-md font-medium text-black dark:text-white">
                                            Extra Charge Panel
                                        </label>

                                    </div> */}
                                    {
                                        formOptions.extraChargePanel.length !== 0 && <div className='mb-6 flex flex-col gap-3'>
                                            <label className="mt-3 block text-md font-medium text-black dark:text-white">
                                                Extra Charge Panel
                                            </label>
                                            <MultiSelect ecpOptions={formOptions.extraChargePanel || []} setSelectedData={setSelectedData} disabled={false} defaultValue={null} />
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
                                        <button type='button' onClick={null} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
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

export default AddBusShort;