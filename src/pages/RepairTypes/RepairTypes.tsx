import React, { useEffect, useState } from 'react';
import TableThree from '../../components/Tables/TableThree';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';

const RepairTypes = () => {
  const token = localStorage.getItem('token')
  const [repairTypes, setRepairTypes] = useState([]);
  const [actions, setActions] = useState(['add', 'edit', 'preview', 'delete'])

  const getRepairTypesList = () => {
    fetch('https://encodehertz.xyz/api/RepairTypes/RepairTypes/List', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Response didnt success');
        }
        return response.json();
      })
      .then(data => {
        setRepairTypes(data);
      })
      .catch(error => {
        console.error('Error', error);
      });
  }

  useEffect(() => {
    getRepairTypesList()
  }, [])

  const handleDelete = async () => {
    const actionID = await parseInt(localStorage.getItem('ActionID'));

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete data.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `https://encodehertz.xyz/api/RepairTypes/RepairTypes/DeleteRange?listOfID=${actionID}`;
        fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.text();
          })
          .then(data => {
            Swal.fire({
              title: 'Success',
              text: data,
              icon: 'success',
            });
            getRepairTypesList();
          })
          .catch(error => {
            Swal.fire({
              title: 'Error',
              text: error.message,
              icon: 'error',
            });
          });
      }
    });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Repair Types' prevPageName='Dashboard' prevRoute='/' />
      <TableThree data={repairTypes} handleDelete={handleDelete} actions={actions}/>
    </DefaultLayout>
  );
};

export default RepairTypes;