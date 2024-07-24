import React, { useState, useEffect } from 'react';
import TableThree from '../../../components/Tables/TableThree';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';

const LongOrders = () => {
  const [busLong, setBusLong] = useState([]);
  const token = localStorage.getItem('token')
  const [actions, setActions] = useState(['add', 'edit', 'preview', 'duplicate', 'delete'])

  const getBusLongList = () => {
    fetch('https://encodehertz.xyz/api/Long/List', {
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
        setBusLong(data);
      })
      .catch(error => {
        console.error('Error', error);
      });
  }

  useEffect(() => {
    getBusLongList()
  }, [])


  const handleDelete = async () => {
    const actionID = localStorage.getItem('ActionID');

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete data.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `https://encodehertz.xyz/api/Long/Delete?bloId=${actionID}`;
        fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
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
            getBusLongList();
          })
          .catch(error => {
            Swal.fire({
              title: 'Error',
              text: error.message,
              icon: 'error',
            });
            console.error('Error deleting data:', error);
          });
      }
    });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Bus long orders' prevPageName='Dashboard' prevRoute='/' />
      <TableThree data={busLong} handleDelete={handleDelete} actions={actions}/>      
    </DefaultLayout>
  );
}

export default LongOrders;