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

interface FormData {
    manager: string;
    cardNumber: string | null;
    employees: [] | null;
    vehicles: [] | null;
    date: string
    comment: string;
    totalAmount: number;
    expenceTypes: { id: number, name: string, price: number, isSelected: boolean }[];
}

interface SelectedData {
    cardNumber: string | null;
    selectedExpenceTypes: { id: number, name: string, price: number }[];

    selectedVehicle: string;
    selectedEmployee: string;

    amount: number;
    totalAmount: number;

    date: string;
    comment: string;
}

const initialSelectedData: SelectedData = {
    cardNumber: '',
    selectedExpenceTypes: [],

    selectedVehicle: '',
    selectedEmployee: '',    

    amount: 0,
    totalAmount: 0,

    date: '',
    comment: '',
};

const EditExpences = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const [formOptions, setFormOptions] = useState<FormData | null>(null);
    const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

    const {
        cardNumber, selectedEmployee, selectedVehicle, selectedExpenceTypes, date, comment, amount, totalAmount
    } = selectedData

    // Form options 

    const getFormOptions = async () => {
        try {
            const response = await fetch('https://encodehertz.xyz/api/ExpencesExpence/Create', {
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
            const response = await fetch(`https://encodehertz.xyz/api/ExpencesExpence/Edit?id=${ActionID}`, {
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


    useEffect(() => {
        console.clear()
        console.log("Maint edit form values:", JSON.stringify(selectedData));
    }, [selectedData])

    // Rentacar Short order post 

    const handleSave = async () => {
        await fetch('https://encodehertz.xyz/api/ExpencesExpence/Edit', {
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
                navigate('/Expences')
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

    const handleChange = (e, inputName) => {
        let inputValue = e.target.value;
    
        if (inputName === "km") {
            if (/^\d*$/.test(inputValue)) {
                inputValue = inputValue === '' ? '0' : parseInt(inputValue, 10).toString();
            } else {
                return;
            }
        } else {
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
        }
    
        setSelectedData(prevData => {
            const updatedData = {
                ...prevData,
                [inputName]: inputValue
            };
            return updatedData;
        });
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
                navigate("/Expences")
            }
        });
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
                                        <SelectGroupOne text="Employee" options={formOptions.employees || []} setSelectedData={setSelectedData} disabled={!formOptions.employees} defaultValue={selectedEmployee} />
                                        <SelectGroupOne text='Vehicle' options={formOptions.vehicles || []} setSelectedData={setSelectedData} disabled={!formOptions.vehicles} defaultValue={selectedVehicle} />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <DatePickerOne labelName="Date" disabled={false} setSelectedData={setSelectedData} value={date} />
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Amount
                                            </label>
                                            <input
                                                onChange={(e) => {handleChange(e, "amount")}}
                                                type="text"
                                                value={amount}
                                                placeholder="Amount"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Total Amount
                                            </label>
                                            <input
                                                onChange={(e) => {handleChange(e, "totalAmount")}}
                                                type="text"
                                                value={totalAmount}
                                                placeholder="Enter total amount"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className='mb-6 flex flex-col gap-3'>
                                        <label className="mt-3 block text-md font-medium text-black dark:text-white">
                                            Repair Types
                                        </label>
                                        <RepairTypesInput repairOptions={formOptions.expenceTypes || []} disabled={false} setSelectedData={setSelectedData} defaultValue={selectedExpenceTypes} stateName='selectedExpenceTypes' />
                                    </div>

                                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                        <div className='w-full'>
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Comment
                                            </label>
                                            <textarea
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
                                        <button type='button' onClick={handleCancel} className="flex w-full justify-center rounded bg-danger dark:bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
                                            Cancel
                                        </button>
                                        <button type='button' onClick={handleSave} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                            Save
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

export default EditExpences;