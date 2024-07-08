import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../layout/DefaultLayout';
import MultiSelect from '../../../components/Forms/MultiSelect';
import Swal from 'sweetalert2';
import DatePickerTwo from '../../../components/Forms/DatePicker/DatePickerTwo';
import RepairTypes from '../../RepairTypes/RepairTypes';
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
    expenceTypes: { id: number, name: string, price: number, description: string, isSelected: boolean }[];
}

interface SelectedData {
    selectedExpenceTypes: { id: number, name: string, price: number, description: string }[];

    selectedVehicle: string;
    selectedEmployee: string;

    amount: number;
    totalAmount: number;

    date: string;
    comment: string;
}

const initialSelectedData: SelectedData = {
    selectedExpenceTypes: [],

    selectedVehicle: '',
    selectedEmployee: '',    

    amount: 0,
    totalAmount: 0,

    date: '',
    comment: '',
};

const AddExpences = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const [formOptions, setFormOptions] = useState<FormData | null>(null);
    const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

    let {
        selectedEmployee, selectedVehicle, selectedExpenceTypes, date, comment, amount, totalAmount
    } = selectedData


    useEffect(() => {
        let newTotalAmount = 0;
        selectedExpenceTypes.forEach((item) => {
            newTotalAmount += item.price;
        });
        setSelectedData(prevState => ({
            ...prevState,
            totalAmount: newTotalAmount
        }));
    }, [selectedExpenceTypes]);

    // Form options 

    useEffect(() => {
        const fetchData = async () => {
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

        fetchData();
    }, []);


    useEffect(() => {
        console.clear()
        console.log("Expences add form values:", selectedData);
    }, [selectedData])

    // Rentacar Short order post 

    const handleSubmit = async () => {
        await fetch('https://encodehertz.xyz/api/Expences/Expence/Create', {
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
                navigate("/expences")
                console.log('Changes discarded');
            }
        });
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Insert" prevPageName='Expences' prevRoute='/expences' />
            {formOptions ? (
                <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <form>
                                <div className="p-6.5">
                                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                        <SelectGroupOne text="Employee" options={formOptions.employees || []} setSelectedData={setSelectedData} disabled={!formOptions.employees} defaultValue='' />
                                        <SelectGroupOne text='Vehicle' options={formOptions.vehicles || []} setSelectedData={setSelectedData} disabled={!formOptions.vehicles} defaultValue='' />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <DatePickerOne labelName="Date" disabled={false} setSelectedData={setSelectedData} value={date} />
                                        <div className='w-full'>

                                        </div>
                                    </div>

                                    <div className='mb-6 flex flex-col gap-3'>
                                        <div className="w-full xl:w-max">
                                            <label className="mb-2.5 block text-black text-xl font-semibold dark:text-white">
                                                Total Amount
                                            </label>
                                            <input
                                                disabled
                                                type="text"
                                                value={totalAmount}
                                                placeholder="Enter total amount"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black font-semibold outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                        <label className="mt-3 block text-md font-medium text-black dark:text-white">
                                            Expence Types
                                        </label>
                                        <RepairTypesInput repairOptions={formOptions.expenceTypes || []} disabled={false} setSelectedData={setSelectedData} defaultValue='' stateName='selectedExpenceTypes' />
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
                                        <button type='button' onClick={handleSubmit} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
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

export default AddExpences;