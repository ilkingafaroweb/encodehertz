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
  
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete data.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
      });
  
      if (result.isConfirmed) {
        const url = `https://encodehertz.xyz/api/Short/DeleteRange?listOfID=${actionID}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.text();
        await Swal.fire({
          title: 'Success',
          text: data,
          icon: 'success',
        });
  
        getBusShortList();
        return true; 
      } else {
        return false; 
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
      console.error('Error deleting data:', error);
      return false; 
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='breadcrumb_bso_lbl' prevPageName='dashboard_lbl' prevRoute='/' />
      <TableThree data={busShort} handleDelete={handleDelete} actions={actions} />      
    </DefaultLayout>
  )
}

export default ShortOrders