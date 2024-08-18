import React, { useEffect, useState } from 'react';
import TableThree from '../../components/Tables/TableThree';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';

const Maintenance = () => {
  const token = localStorage.getItem('token')
  const [maintenance, setMaintenance] = useState([]);
  const [actions, setActions] = useState(['add', 'edit', 'preview', 'delete'])

  const getMaintenanceList = () => {
    fetch('https://encodehertz.xyz/api/MaintenanceMaintenance/List', {
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
        setMaintenance(data);
      })
      .catch(error => {
        console.error('Error', error);
      });
  }

  useEffect(() => {
    getMaintenanceList()
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
        const url = `https://encodehertz.xyz/api/MaintenanceMaintenance/DeleteRange?listOfID=${actionID}`;
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
            getMaintenanceList();
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
      <Breadcrumb pageName='Maintenance' prevPageName='Dashboard' prevRoute='/' />
      <TableThree data={maintenance} handleDelete={handleDelete} actions={actions}/>
    </DefaultLayout>
  );
};

export default Maintenance;