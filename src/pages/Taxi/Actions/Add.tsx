import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../layout/DefaultLayout';
import MultiSelect from '../../../components/Forms/MultiSelect';
import Swal from 'sweetalert2';
import DatePickerTwo from '../../../components/Forms/DatePicker/DatePickerTwo';
import TransactionPeriod from '../../../components/Forms/DatePicker/TransactionPeriod';
import { toast } from 'react-toastify';

interface FormData {
    cardNumber: string | null;
    customers: { value: string; text: string }[];
    selectedCustomer: string | null;
    transactionPeriod: string;
    paymentMethods: { value: string; text: string }[];
    selectedPaymentMethod: string | null;
    comment: string | null;
    km: { quantity: number, totalPrice: number };
    airportTransfer: { quantity: number, totalPrice: number };
    region: { quantity: number, totalPrice: number };
    waitingTime: { quantity: number, totalPrice: number };
    cancelledTrip: { quantity: number, totalPrice: number };
    otherComment: string;
    otherPrice: number;
    extraChargePanel: any[];
}

interface SelectedData {
    cardNumber: string | null;
    selectedCustomer: string | null;
    transactionPeriod: string;
    selectedPaymentMethod: string | null;
    comment: string | null;
    km: { quantity: number, totalPrice: number };
    airportTransfer: { quantity: number, totalPrice: number };
    region: { quantity: number, totalPrice: number };
    waitingTime: { quantity: number, totalPrice: number };
    cancelledTrip: { quantity: number, totalPrice: number };
    otherComment: string;
    otherPrice: number;
    extraChargePanel: any[];
}

const initialSelectedData: SelectedData = {
    cardNumber: "",
    selectedCustomer: "",
    transactionPeriod: "",
    selectedPaymentMethod: "",
    comment: "",
    km: { quantity: 0, totalPrice: 0 },
    airportTransfer: { quantity: 0, totalPrice: 0 },
    region: { quantity: 0, totalPrice: 0 },
    waitingTime: { quantity: 0, totalPrice: 0 },
    cancelledTrip: { quantity: 0, totalPrice: 0 },
    otherComment: "",
    otherPrice: 0,
    extraChargePanel: [],
};

const AddTaxi = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const [formOptions, setFormOptions] = useState<FormData | null>(null);
    const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);
    const [invalidFields, setInvalidFields] = useState<string[]>([])

    const { selectedCustomer, transactionPeriod, otherComment, otherPrice, km } = selectedData

    const getRequiredFields = () => [
        { value: selectedCustomer, label: "Customer" },
        { value: transactionPeriod, label: "Transaction Period" },
    ];

    const validateForm = (): boolean => {
        const requiredFields = getRequiredFields();

        const newInvalidFields = requiredFields.filter(field => {
            if (Array.isArray(field.value)) {
                return field.value.length === 0;
            }
            return !field.value;
        }).map(field => field.label);

        setInvalidFields(prevInvalidFields => prevInvalidFields.filter(field => newInvalidFields.includes(field)));

        if (newInvalidFields.length > 0) {
            toast.warn("The fields marked below are mandatory");
            setInvalidFields(newInvalidFields);
            return false;
        }

        setInvalidFields([]);
        return true;
    };

    useEffect(() => {
        const requiredFields = getRequiredFields();
        const validFields = requiredFields.filter(field => field.value).map(field => field.label);
        setInvalidFields(prevInvalidFields => prevInvalidFields.filter(field => !validFields.includes(field)));
    }, [selectedCustomer, transactionPeriod]);

    // Form options 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://encodehertz.xyz/api/Taxi/Taxi/Create', {
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
        console.clear()
        console.log("Taxi add datas ----> ", selectedData);
    }, [selectedData])

    // Rentacar Short order post 

    const addTaxi = async () => {

        if (!validateForm()) return;

        await fetch('https://encodehertz.xyz/api/Taxi/Taxi/Create', {
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
                navigate('/taxi')
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error,
                });
            });
    }

    const handleChange = (e, objectName, keyName) => {
        let inputValue = e.target.value;
    
        if (inputValue === '') {
            inputValue = '0';
        } else {
            if (/^[0-9]*\.?[0-9]*$/.test(inputValue)) {
                if (inputValue.includes('.')) {
                    inputValue = inputValue.replace(/^0+(?=\d)/, '');
                } else {
                    inputValue = parseFloat(inputValue).toString();
                }
            } else {
                return;
            }
        }
    
        setSelectedData(prevData => {
            const updatedData = {
                ...prevData,
                [objectName]: {
                    ...prevData[objectName],
                    [keyName]: inputValue
                }
            };
            return updatedData;
        });
    };

    const handleChangeOtherPrice = (e) => {
        let inputValue = e.target.value;
    
        if (inputValue === '') {
            inputValue = '0';
        } else {
            const isValidNumber = /^[0-9]*\.?[0-9]*$/.test(inputValue);
            
            if (isValidNumber) {
                if (inputValue.includes('.')) {
                    inputValue = inputValue.replace(/^0+(?=\d)/, '');
                } else {
                    inputValue = parseFloat(inputValue).toString();
                }
            } else {
                return; 
            }
        }
    
        setSelectedData(prevData => ({
            ...prevData,
            otherPrice: inputValue
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
                navigate("/taxi")
            }
        });
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Insert" prevPageName='Taxi' prevRoute='/taxi' />
            {formOptions ? (
                <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <form>
                                <div className="p-6.5">
                                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                        <SelectGroupOne text="Customer" options={formOptions.customers || []} setSelectedData={setSelectedData} disabled={!formOptions.customers} defaultValue='' isInvalid={invalidFields.includes('Customer')}/>
                                        <SelectGroupOne text="Payment Method" options={formOptions.paymentMethods || []} setSelectedData={setSelectedData} disabled={!formOptions.paymentMethods} defaultValue='' />
                                        <TransactionPeriod labelName="Transaction Period" disabled={false} setSelectedData={setSelectedData} value={transactionPeriod} isInvalid={invalidFields.includes('Transaction Period')}/>
                                    </div>

                                    <div className='flex flex-col justify-between mb-6 lg:flex-row'>
                                        <div className="mb-2 flex flex-col items-center gap-3">
                                            <p className='text-red-700 dark:text-yellow-500 text-2xl lg:mt-3'>KM</p>
                                            <div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Quantity
                                                </label>
                                                <input
                                                    value={selectedData.km.quantity}
                                                    onChange={(e) => handleChange(e, 'km', 'quantity')}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Total Price
                                                </label>
                                                <input
                                                    value={selectedData.km.totalPrice}
                                                    onChange={(e) => handleChange(e, 'km', 'totalPrice')}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div>

                                        </div>

                                        <div className="mb-2 flex flex-col items-center gap-3">
                                            <p className='text-red-700 dark:text-yellow-500 text-2xl lg:mt-3'>Airport Transfer</p>
                                            <div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Quantity
                                                </label>
                                                <input
                                                    value={selectedData.airportTransfer.quantity}
                                                    onChange={(e) => handleChange(e, 'airportTransfer', 'quantity')}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Total Price
                                                </label>
                                                <input
                                                    value={selectedData.airportTransfer.totalPrice}
                                                    onChange={(e) => handleChange(e, 'airportTransfer', 'totalPrice')}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div>

                                        </div>

                                        <div className="mb-2 flex flex-col items-center gap-3">
                                            <p className='text-red-700 dark:text-yellow-500 text-2xl lg:mt-3'>Region</p>
                                            <div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Quantity
                                                </label>
                                                <input
                                                    value={selectedData.region.quantity}
                                                    onChange={(e) => handleChange(e, 'region', 'quantity')}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Total Price
                                                </label>
                                                <input
                                                    value={selectedData.region.totalPrice}
                                                    onChange={(e) => handleChange(e, 'region', 'totalPrice')}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div>

                                        </div>

                                        <div className="mb-2 flex flex-col items-center gap-3">
                                            <p className='text-red-700 dark:text-yellow-500 text-2xl lg:mt-3'>Waiting Time</p>
                                            <div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Quantity
                                                </label>
                                                <input
                                                    value={selectedData.waitingTime.quantity}
                                                    onChange={(e) => handleChange(e, 'waitingTime', 'quantity')}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Total Price
                                                </label>
                                                <input
                                                    value={selectedData.waitingTime.totalPrice}
                                                    onChange={(e) => handleChange(e, 'waitingTime', 'totalPrice')}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div>

                                        </div>

                                        <div className="mb-2 flex flex-col items-center gap-3">
                                            <p className='text-red-700 dark:text-yellow-500 text-2xl lg:mt-3'>Cancelled Trip</p>
                                            <div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Quantity
                                                </label>
                                                <input
                                                    value={selectedData.cancelledTrip.quantity}
                                                    onChange={(e) => handleChange(e, 'cancelledTrip', 'quantity')}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Total Price
                                                </label>
                                                <input
                                                    value={selectedData.cancelledTrip.totalPrice}
                                                    onChange={(e) => handleChange(e, 'cancelledTrip', 'totalPrice')}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div>
                                        </div>

                                        <div className="mb-2 flex flex-col items-center gap-3">
                                            <p className='text-red-700 dark:text-yellow-500 text-2xl lg:mt-3'>Other Service</p>
                                            <div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Service Name
                                                </label>
                                                <input
                                                    value={otherComment}
                                                    onChange={(e) => setSelectedData(prevData => ({
                                                        ...prevData,
                                                        otherComment: e.target.value
                                                    }))}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Service Price
                                                </label>
                                                <input
                                                    value={otherPrice}
                                                    onChange={(e) => handleChangeOtherPrice(e)}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div>

                                        </div>
                                    </div>
                                    {
                                        formOptions?.extraChargePanel?.length !== 0 && <div className='mb-6 flex flex-col gap-3'>
                                            <label className="mt-3 block text-md font-medium text-black dark:text-white">
                                                Extra Charge Panel
                                            </label>
                                            <MultiSelect ecpOptions={formOptions.extraChargePanel || []} setSelectedData={setSelectedData} disabled={false} defaultValue={null} outsource={false} />
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
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className='flex gap-3'>
                                        <button type='button' onClick={handleCancel} className="flex w-full justify-center rounded bg-danger dark:bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
                                            Cancel
                                        </button>
                                        <button type='button' onClick={addTaxi} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
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

export default AddTaxi;