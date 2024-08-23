import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import DefaultLayout from '../../../layout/DefaultLayout';
import Swal from 'sweetalert2';

interface SourcesForm {
  name: string;
  description: string;
}

const initialFormValues: SourcesForm = {
  name: '',
  description: '',
};

const AddSources: React.FC = () => {
  const token = localStorage.getItem('token')
  const [selectedData, setSelectedData] = useState<SourcesForm>(initialFormValues);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Sources add selected data : ", selectedData);
  }, [selectedData])

  const postData = {
    name: selectedData.name,
    description: selectedData.description,
  };


  useEffect(() => {
    console.log(selectedData);
    console.log(JSON.stringify(postData));
  }, [selectedData]);

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
        navigate("/sources");
      }
    });
  };

  const handleAdd = () => {
    fetch('http://85.190.242.108:4483/api/Source/Create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData),
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
        navigate('/sources')
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
      });

  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Insert" prevPageName='Sources list' prevRoute='/sources' />
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
                      value={selectedData.name}
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
                      value={selectedData.description}
                      onChange={(e) => setSelectedData(prevData => ({ ...prevData, description: e.target.value }))}
                      rows={4}
                      placeholder="Type your description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <button type='button' onClick={handleCancel} className="flex w-full justify-center rounded bg-danger dark:bg-danger p-3 font-medium text-gray hover:bg-opacity-90">
                    Cancel
                  </button>
                  <button type='button' onClick={handleAdd} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    Insert
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

export default AddSources;
