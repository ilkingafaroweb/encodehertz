import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../../layout/DefaultLayout';
import DatePickerOne from '../../../../components/Forms/DatePicker/DatePickerOne';
import MultiSelect from '../../../../components/Forms/MultiSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const DuplicateBusLong = () => {

    const [showExtraCharge, setShowExtraCharge] = useState(false)

    const navigate = useNavigate()

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
                navigate(-1)
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
                navigate(-1)
            }
        });
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Edit Bus Long Orders" />

            <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <form action="#">
                            <div className="p-6.5">
                                <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Card Number
                                        </label>
                                        <input
                                            readOnly
                                            disabled
                                            type="text"
                                            placeholder="Enter..."
                                            value="BLO-0124-000001"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <SelectGroupOne text="Card Type" disabled={false} />
                                </div>

                                <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                    <DatePickerOne labelName="Start Date Time" disabled={false} />
                                    <DatePickerOne labelName="End Date Time" disabled={false} />
                                </div>

                                <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                    <SelectGroupOne text="Customer" disabled={false} />
                                    <SelectGroupOne text="Source" disabled={false} />
                                </div>

                                <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                    <SelectGroupOne text="Service Type" disabled={false} />
                                    <SelectGroupOne text="Contract" disabled={false} />
                                </div>

                                <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                    <SelectGroupOne text="Driver" disabled={false} />
                                </div>

                                <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                    <SelectGroupOne text="Vehicle Class" disabled={false} />
                                    <SelectGroupOne text="Vehicle" disabled={false} />
                                </div>

                                <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                    <SelectGroupOne text="Customer Payment Method" disabled={false} />
                                    <div className="w-full xl:w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Price To Costumer Monthly
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter price"
                                            inputMode='numeric'
                                            min={0}
                                            step="1"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                    <div className="w-full xl:w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Requested Person
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter person name"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <SelectGroupOne text="Supplier" disabled={false} />
                                </div>

                                <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                                    <div className="w-full xl:w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Price To Outsource Monthly
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Enter outsource price"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <SelectGroupOne text="Outsource Payment Method" disabled={false} />
                                </div>

                                <div className='mb-3 w-full flex justify-between items-end'>
                                    <label className="mb-3 block text-md font-medium text-black dark:text-white">
                                        Extra Charge Panel
                                    </label>
                                    <button
                                        type='button'
                                        onClick={() => setShowExtraCharge(!showExtraCharge)}
                                        className='flex w-12 h-12 justify-center items-center rounded bg-white border border-stroke dark:bg-boxdark-2 p-3 font-medium dark:border-form-strokedark dark:text-gray hover:bg-opacity-90'>
                                        {showExtraCharge ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
                                    </button>
                                </div>
                                {
                                    showExtraCharge && <div className='mb-6 flex flex-col gap-6 xl:flex-row'>
                                        <MultiSelect id="1" disabled={false} />
                                    </div>
                                }

                                <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                    <div className='w-full'>
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Comment
                                        </label>
                                        <textarea
                                            rows={6}
                                            placeholder="Type your comment"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className='flex gap-3'>
                                    <button
                                        type='button'
                                        onClick={handleCancel}
                                        className="flex w-full justify-center rounded bg-danger dark:bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
                                        Cancel
                                    </button>
                                    <button
                                        type='button'
                                        onClick={handleAdd}
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                        Add
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default DuplicateBusLong;