import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../layout/DefaultLayout';
import MultiSelect from '../../../components/Forms/MultiSelect';
import Swal from 'sweetalert2';
import DatePickerTwo from '../../../components/Forms/DatePicker/DatePickerTwo';
import TransactionPeriod from '../../../components/Forms/DatePicker/TransactionPeriod';

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

const PreviewTaxi = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const [formOptions, setFormOptions] = useState<FormData | null>(null);
    const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

    const {cardNumber, transactionPeriod, otherComment, otherPrice, selectedCustomer, selectedPaymentMethod, extraChargePanel, comment } = selectedData

    // Form options 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://85.190.242.108:4483/api/Taxi/Taxi/Create', {
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

        const previewData = async () => {
            const actionID = localStorage.getItem("ActionID")
            try {
                const response = await fetch(`http://85.190.242.108:4483/api/Taxi/Taxi/Edit?toId=${actionID}`, {
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
        } 

        fetchData();
        previewData()
    }, []);

    const handleBack = () => {
        navigate('/taxi')
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName={`Preview / ${cardNumber}`} prevPageName='Taxi' prevRoute='/taxi' />
            {formOptions ? (
                <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <form>
                                <div className="p-6.5">
                                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                        <SelectGroupOne text="Customer" options={formOptions.customers || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedCustomer} />
                                        <SelectGroupOne text="Payment Method" options={formOptions.paymentMethods || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedPaymentMethod} />
                                        <TransactionPeriod labelName="Transaction Period" disabled={true} setSelectedData={setSelectedData} value={transactionPeriod} />
                                    </div>

                                    <div className='flex flex-col justify-between mb-6 lg:flex-row'>
                                        <div className="mb-2 flex flex-col items-center gap-3">
                                            <p className='text-red-700 dark:text-yellow-500 text-2xl lg:mt-3'>KM</p>
                                            <div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Quantity
                                                </label>
                                                <input
                                                    disabled
                                                    value={selectedData.km?.quantity}
                                                    placeholder="Type your comment"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Total Price
                                                </label>
                                                <input
                                                    disabled
                                                    value={selectedData.km?.totalPrice}
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
                                                    disabled
                                                    value={selectedData.airportTransfer?.quantity}
                                                    placeholder="Type your comment"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Total Price
                                                </label>
                                                <input
                                                    disabled
                                                    value={selectedData.airportTransfer?.totalPrice}
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
                                                    disabled
                                                    value={selectedData.region?.quantity}
                                                    placeholder="Type your comment"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Total Price
                                                </label>
                                                <input
                                                    disabled
                                                    value={selectedData.region?.totalPrice}
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
                                                    disabled
                                                    value={selectedData.waitingTime?.quantity}
                                                    placeholder="Type your comment"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Total Price
                                                </label>
                                                <input
                                                    disabled
                                                    value={selectedData.waitingTime?.totalPrice}
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
                                                    disabled
                                                    value={selectedData.cancelledTrip?.quantity}
                                                    placeholder="Type your comment"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Total Price
                                                </label>
                                                <input
                                                    disabled
                                                    value={selectedData.cancelledTrip?.totalPrice}
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
                                                    disabled
                                                    placeholder="Type service name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                ></input>
                                            </div><div className='w-full'>
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Service Price
                                                </label>
                                                <input
                                                    value={otherPrice}
                                                    disabled
                                                    placeholder="Enter total price"
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
                                            <MultiSelect ecpOptions={formOptions.extraChargePanel || []} setSelectedData={setSelectedData} disabled={true} defaultValue={extraChargePanel} outsource={false} />
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

export default PreviewTaxi;