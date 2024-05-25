import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../layout/DefaultLayout';
import Swal from 'sweetalert2';

interface DepartmentCode {
  value: string;
  text: string;
}

interface ExtraChargeForm {
  id: number;
  userId: null | string;
  name: null | string;
  description: null | string;
  customerPrice: number | null;
  outsourcePrice: number | null;
  quantity: number;
  departmentCodes: DepartmentCode[];
  selectedDepartmentCodes: DepartmentCode[];
  selectedDepartment: string;
}

const initialFormValues: ExtraChargeForm = {
  id: 0,
  userId: localStorage.getItem("userId"),
  name: null,
  description: null,
  customerPrice: null,
  outsourcePrice: null,
  quantity: 0,
  departmentCodes: [],
  selectedDepartmentCodes: [],
  selectedDepartment: ''
};

const PreviewExtraCharge: React.FC = () => {
  const token = localStorage.getItem('token')
  const [selectedData, setSelectedData] = useState<ExtraChargeForm>(initialFormValues);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ActionID = localStorage.getItem("ActionID")
        const response = await fetch(`https://encodehertz.xyz/api/ECP/Edit?id=${ActionID}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSelectedData(data as ExtraChargeForm);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Preview" prevPageName='Extra charge list' prevRoute='/extraCharges' />
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
                      disabled
                      value={selectedData.name || ''}
                      onChange={(e) => setSelectedData(prevData => ({ ...prevData, name: e.target.value }))}
                      type="text"
                      placeholder="Enter name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <SelectGroupOne text="Department" options={selectedData?.departmentCodes || []} setSelectedData={setSelectedData} disabled={true} defaultValue={selectedData.selectedDepartment}/>
                </div>
                <div className='mb-3 flex flex-col gap-6 xl:flex-row'>
                  <div className="w-full xl:w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Customer Price
                    </label>
                    <input
                      disabled
                      value={selectedData.customerPrice || ''}
                      onChange={(e) => setSelectedData(prevData => ({ ...prevData, customerPrice: Number(e.target.value) }))}
                      type="number"
                      placeholder="Enter customer price"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Outsource Price
                    </label>
                    <input
                      disabled
                      value={selectedData.outsourcePrice || ''}
                      onChange={(e) => setSelectedData(prevData => ({ ...prevData, outsourcePrice: Number(e.target.value) }))}
                      type="number"
                      placeholder="Enter outsource price"
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
                      disabled
                      value={selectedData.description || ''}
                      onChange={(e) => setSelectedData(prevData => ({ ...prevData, description: e.target.value }))}
                      rows={4}
                      placeholder="Type your description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>
                </div>
                {/* <div className='flex gap-3'>
                  <button type='button' onClick={handleCancel} className="flex w-full justify-center rounded bg-danger dark:bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
                    Cancel
                  </button>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PreviewExtraCharge;
