import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../layout/DefaultLayout';
import MultiSelect from '../../../components/Forms/MultiSelect';
import Swal from 'sweetalert2';
import DatePickerTwo from '../../../components/Forms/DatePicker/DatePickerTwo';
import RepairTypesInput from '../../../components/Forms/RepairTypes';
import DatePickerOne from '../../../components/Forms/DatePicker/DatePickerOne';
import ExpenceTypesInput from '../../../components/Forms/ExpenceTypes';
import ExpenceTypes from '../../ExpenceTypes/ExpenceTypes';

interface Option {
    id: number;
    name: string;

    quantity: number;
    unitPrice: number;
    totalAmount: number;

    description: string;
    isSelected: boolean | null;
}

interface FormData {
    manager: string;
    cardNumber: string | null;
    employees: [] | null;
    vehicles: [] | null;
    date: string
    comment: string;
    totalAmount: number;
    expenceTypes: Option[] | [];
}

interface SelectedData {
    cardNumber: string | null;

    expenceTypes: Option[];
    selectedExpenceTypes: Option[];

    selectedVehicle: string;
    selectedEmployee: string;

    amount: number;
    totalPrice: number | string;

    date: string;
    comment: string;
}

const initialSelectedData: SelectedData = {
    cardNumber: '',
    expenceTypes: [],
    selectedExpenceTypes: [],

    selectedVehicle: '',
    selectedEmployee: '',

    amount: 0,
    totalPrice: 0,

    date: '',
    comment: '',
};

const PreviewExpences = () => {
    const navigate = useNavigate()
    const actionID = localStorage.getItem('ActionID')
    const token = localStorage.getItem("token")
    const [formOptions, setFormOptions] = useState<FormData | null>(null);
    const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

    let {
        selectedEmployee, selectedVehicle, selectedExpenceTypes, expenceTypes, date, comment, totalPrice, cardNumber
    } = selectedData

    useEffect(() => {
        let newTotalAmount = 0;
        selectedExpenceTypes?.forEach((item) => {
            newTotalAmount += item.totalAmount;
        });
        setSelectedData(prevState => ({
            ...prevState,
            totalPrice: newTotalAmount.toFixed(2)
        }));
    }, [selectedExpenceTypes]);

    // Form options 

    const getFormOptions = async () => {
        try {
            const response = await fetch('https://encodehertz.xyz/api/Expences/Expence/Create', {
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

    const getEdit = async () => {
        try {
            const ActionID = await localStorage.getItem("ActionID")
            const response = await fetch(`https://encodehertz.xyz/api/Expences/Expence/Edit?id=${ActionID}`, {
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
            console.error(error);
        }
    };

    useEffect(() => {
        getFormOptions();
        getEdit();
    }, []);

    const handleSave = async () => {
        await fetch('https://encodehertz.xyz/api/Expences/Expence/Edit', {
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
                navigate('/expences')
            })
            .catch(error => {
                console.error('Error sending data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error,
                });
            });
    }

    const handleBack = () => {
        navigate("/expences")
    };


    return (
        <DefaultLayout>
            <Breadcrumb pageName={`Edit / ${cardNumber}`} prevPageName='Expences' prevRoute='/expences' />
            {formOptions ? (
                <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <form>
                                <div className="p-6.5">
                                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Employee
                                            </label>
                                            <input
                                                disabled
                                                value={selectedEmployee}
                                                type="text"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                        <SelectGroupOne text='Vehicle' options={formOptions.vehicles || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedVehicle} />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <DatePickerOne labelName="Date" disabled={true} setSelectedData={setSelectedData} value={date} />
                                        <div className='w-full'>

                                        </div>
                                    </div>

                                    <div className='mb-6 flex flex-col gap-3'>
                                        <div className="w-full xl:w-max">
                                            <label className="mb-2.5 block text-black text-xl font-semibold dark:text-white">
                                                Total Price
                                            </label>
                                            <input
                                                disabled
                                                type="text"
                                                value={totalPrice}
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black font-semibold outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                        {
                                            formOptions.expenceTypes?.length > 0 && <><label className="mt-3 block text-md font-medium text-black dark:text-white">
                                                Expence Types
                                            </label>
                                                <ExpenceTypesInput expenceOptions={formOptions.expenceTypes || []} disabled={true} setSelectedData={setSelectedData} defaultValue={expenceTypes} stateName='selectedExpenceTypes' />
                                            </>
                                        }</div>

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
                                        <button type='button' onClick={handleBack} className="flex w-full justify-center rounded bg-danger dark:bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
                                            Cancel
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

export default PreviewExpences;