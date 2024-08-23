import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';

interface ExpenceTypesForm {
    name: string;
    description: string;
}

const initialFormValues: ExpenceTypesForm = {
    name: '',
    description: '',
};

const PreviewExpenceTypes: React.FC = () => {
    const token = localStorage.getItem('token')
    const [selectedData, setSelectedData] = useState<ExpenceTypesForm>(initialFormValues);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ActionID = localStorage.getItem("ActionID")
                const response = await fetch(`http://85.190.242.108:4483/api/Expences/ExpenceType/Preview?id=${ActionID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSelectedData(data as ExpenceTypesForm);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    const handleBack = () => {
        navigate("/expenceTypes");
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Preview" prevPageName='Expence Types' prevRoute='/expenceTypes' />
            <div className="max-w-full mx-auto gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <form action="#">
                            <div className="p-6.5">
                                <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Name
                                        </label>
                                        <input
                                            required
                                            disabled
                                            value={selectedData.name || ''}
                                            onChange={(e) => setSelectedData(prevData => ({ ...prevData, name: e.target.value }))}
                                            type="text"
                                            placeholder="Enter name"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                                    <div className='w-full'>
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Description
                                        </label>
                                        <textarea
                                            required
                                            disabled
                                            value={selectedData.description || ''}
                                            onChange={(e) => setSelectedData(prevData => ({ ...prevData, description: e.target.value }))}
                                            rows={4}
                                            placeholder="Type your description"
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
        </DefaultLayout>
    );
};

export default PreviewExpenceTypes;