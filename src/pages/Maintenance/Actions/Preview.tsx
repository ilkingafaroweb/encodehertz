import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../layout/DefaultLayout';
import MultiSelect from '../../../components/Forms/MultiSelect';
import Swal from 'sweetalert2';
import DatePickerTwo from '../../../components/Forms/DatePicker/DatePickerTwo';
import RepairTypesInput from '../../../components/Forms/RepairTypes';

interface FormData {
    cardNumber: string | null;
    suppliers: { value: string; text: string }[];
    vehicles: [] | null;
    startDateTime: string;
    endDateTime: string;
    comment: string;
    totalAmount: number;
    repairTypes: { id: number, name: string, price: number, isSelected: boolean }[];
}

interface SelectedData {
    cardNumber: string;
    selectedSupplier: string;
    repairTypes: { id: number, name: string, price: number, isSelected: boolean }[];
    selectedVehicle: string;

    startDateTime: string;
    endDateTime: string;

    comment: string;
    totalAmount: number | string;
    km: number;
}

const initialSelectedData: SelectedData = {
    cardNumber: '',
    selectedSupplier: '',
    repairTypes: [],
    selectedVehicle: '',

    startDateTime: '',
    endDateTime: '',

    comment: '',
    totalAmount: 0,
    km: 0,
};

const PreviewMaintenance = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const [formOptions, setFormOptions] = useState<FormData | null>(null);
    const [selectedData, setSelectedData] = useState<SelectedData>(initialSelectedData);

    const {
        cardNumber, selectedSupplier, selectedVehicle, repairTypes, startDateTime, endDateTime, comment, totalAmount, km
    } = selectedData

    // Form options 

    const getFormOptions = async () => {
        try {
            const response = await fetch('http://85.190.242.108:4483/api/MaintenanceMaintenance/Create', {
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
            const response = await fetch(`http://85.190.242.108:4483/api/MaintenanceMaintenance/Edit?id=${ActionID}`, {
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
        console.log("Rentacar Short orders add form values:", selectedData);
    }, [selectedData])


    // Vehicles list

    const getVehicleList = async () => {
        if (!!startDateTime && !!endDateTime) {
            await fetch(`http://85.190.242.108:4483/api/MaintenanceMaintenance/GetVehicles?startDate=${startDateTime}&endDate=${endDateTime}`, {
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
    }, [startDateTime, endDateTime]);





    const handleBack = () => {
        navigate("/maintenance")
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName={`Preview / ${cardNumber}`} prevPageName='Maintenance' prevRoute='/maintenance' />
            {formOptions ? (
                <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <form>
                                <div className="p-6.5">
                                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                        <SelectGroupOne text="Supplier" options={formOptions.suppliers || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedSupplier} />
                                        <SelectGroupOne text='Vehicle' options={formOptions.vehicles || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedVehicle} />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <DatePickerTwo labelName="Start Date Time" disabled={true} setSelectedData={setSelectedData} value={startDateTime} />
                                        <DatePickerTwo labelName="End Date Time" disabled={true} setSelectedData={setSelectedData} value={endDateTime} />
                                    </div>

                                    <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                        <div className="w-full xl:w-full">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Kilometer
                                            </label>
                                            <input
                                                disabled
                                                type="text"
                                                value={km}
                                                placeholder="Enter km"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                        <div className="w-full xl:w-full">

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
                                            Repair Types
                                        </label>
                                        <RepairTypesInput repairOptions={formOptions.repairTypes || []} disabled={true} setSelectedData={setSelectedData} defaultValue={repairTypes} stateName='selectedRepairTypes' />
                                    </div>

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

export default PreviewMaintenance;