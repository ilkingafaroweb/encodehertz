import React, { useEffect, useState } from 'react';
import TableThree from '../../components/Tables/TableThree';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';

const ExtraCharges = () => {
  const token = localStorage.getItem('token')
  const [extraCharges, setExtraCharges] = useState([]);
  const [update, setUpdate] = useState(false); 


  useEffect(() => {
    fetch('https://encodehertz.xyz/api/ECP/List', {
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
        setExtraCharges(data);
      })
      .catch(error => {
        console.error('Error', error);
      });
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
        const url = `https://encodehertz.xyz/api/ECP/Delete?id=${actionID}`;
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
          setUpdate(prev => !prev); 
        })
        .catch(error => {
          Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error',
          });
          console.error('Error deleting data:', error);
        });
      }
    });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Extra Charges' prevPageName='Dashboard' prevRoute='/' />
      {extraCharges.length > 0 ? (
        <TableThree data={extraCharges} handleDelete={handleDelete} />
      ) : (
        <p>No extra charges found.</p>
      )}
    </DefaultLayout>
  );
};

export default ExtraCharges;