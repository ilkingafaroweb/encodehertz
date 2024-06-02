import React, { useState, useEffect } from 'react';
import TableThree from '../../../components/Tables/TableThree';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';

const RentShortOrders = () => {
  const [carShort, setCarShort] = useState([]);
  const [update, setUpdate] = useState(false); 

  const getCarShortList = async () => {
    const token = await localStorage.getItem("token");

    fetch('https://encodehertz.xyz/api/RentCar/Short/List', {
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
        setCarShort(data);
      })
      .catch(error => {
        console.error('Error', error);
      });
  }

  useEffect(() => {
    getCarShortList() 
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
        const url = `https://encodehertz.xyz/api/RentCar/Short/Delete?id=${actionID}`;
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
          getCarShortList()
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
      <Breadcrumb pageName='Rent a car short orders' prevPageName='Dashboard' prevRoute='/'/>
      {
        carShort.length > 0 && (<TableThree data={carShort} handleDelete={handleDelete} />)
      }
    </DefaultLayout>
  );
}

export default RentShortOrders;