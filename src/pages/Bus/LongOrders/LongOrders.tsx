import React, { useState, useEffect } from 'react';
import TableThree from '../../../components/Tables/TableThree';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import useLayout from '../../../hooks/useLayout';

const LongOrders = () => {

  const token = localStorage.getItem('token')
  
  const [busLong, setBusLong] = useState([]);
  const [actions, setActions] = useState(['add', 'edit', 'preview', 'duplicate', 'delete'])

  const { layout, loading, error } = useLayout('buslongorder');

  const getBusLongList = () => {
    fetch('http://85.190.242.108:4483/api/Long/List', {
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
        const url = `http://85.190.242.108:4483/api/Long/DeleteRange?listOfID=${actionID}`;
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
  
        getBusLongList();
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
      <Breadcrumb pageName='breadcrumb_blo_lbl' prevPageName='dashboard_lbl' prevRoute='/' />
      <TableThree layout={layout} data={busLong} handleDelete={handleDelete} actions={actions}/>      
    </DefaultLayout>
  );
}

export default LongOrders;