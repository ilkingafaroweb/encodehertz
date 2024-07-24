import React, { useEffect, useState } from 'react'
import TableThree from '../../../components/Tables/TableThree'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb'
import BusShortData from '../../../data/Bus/ShortOrders'
import Swal from 'sweetalert2'

const ShortOrders = () => {

  const [busShort, setBusShort] = useState([]);
  const token = localStorage.getItem('token')
  const [actions, setActions] = useState(['add', 'edit', 'preview', 'duplicate', 'delete'])

  const getBusShortList = () => {
    fetch('https://encodehertz.xyz/api/Short/List', {
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
        setBusShort(data);
      })
      .catch(error => {
        console.error('Error', error);
      });
  }

  useEffect(() => {
    getBusShortList()
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
        const url = `https://encodehertz.xyz/api/Short/Delete?bsoId=${actionID}`;
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
            getBusShortList();
          })
          .catch(error => {
            Swal.fire({
              title: 'Error',
              text: error,
              icon: 'error',
            });
          });
      }
    });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Bus Short Orders' prevPageName='Dashboard' prevRoute='/' />
      <TableThree data={busShort} handleDelete={handleDelete} actions={actions} />      
    </DefaultLayout>
  )
}

export default ShortOrders