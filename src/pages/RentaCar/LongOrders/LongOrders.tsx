import React, { useState, useEffect } from 'react';
import TableThree from '../../../components/Tables/TableThree';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import RentLongData from '../../../data/Rentacar/LongOrders'

const RentLongOrders = () => {
  const [carLong, setCarLong] = useState([]);
  const [update, setUpdate] = useState(false); 
  const [actions, setActions] = useState(['add', 'edit', 'preview', 'duplicate', 'delete'])

  const getCarLongList = async () => {
    const token = await localStorage.getItem("token");

    fetch('https://encodehertz.xyz/api/RentCar/Long/List', {
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
        setCarLong(data);
      })
      .catch(error => {
        console.error('Error', error);
      });
  }

  useEffect(() => {
    getCarLongList() 
  }, [])
  

  const handleDelete = async () => {
    const actionID = localStorage.getItem('ActionID');
    const token = await localStorage.getItem("token");

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete data.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `https://encodehertz.xyz/api/RentCar/Long/Delete?id=${actionID}`;
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
          getCarLongList()
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
      <Breadcrumb pageName='Rent a car long orders' prevPageName='Dashboard' prevRoute='/'/>
      <TableThree data={carLong} handleDelete={handleDelete} actions={actions}/>
    </DefaultLayout>
  );
}

export default RentLongOrders;