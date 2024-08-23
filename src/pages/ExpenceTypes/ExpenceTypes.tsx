import React, { useEffect, useState } from 'react';
import TableThree from '../../components/Tables/TableThree';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';

const ExpenceTypes = () => {
  const token = localStorage.getItem('token')
  const [expenceTypes, setExpenceTypes] = useState([]);
  const [actions, setActions] = useState(['preview'])

  const getExpenceTypesList = () => {
    fetch('http://85.190.242.108:4483/api/Expences/ExpenceType/List', {
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
        setExpenceTypes(data);
      })
      .catch(error => {
        console.error('Error', error);
      });
  }

  useEffect(() => {
    getExpenceTypesList()
  }, [])

  // const handleDelete = async () => {
  //   const actionID = localStorage.getItem('ActionID');
  
  //   try {
  //     const result = await Swal.fire({
  //       title: 'Are you sure?',
  //       text: 'You are about to delete data.',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes, delete it!',
  //       cancelButtonText: 'No, cancel!'
  //     });
  
  //     if (result.isConfirmed) {
  //       const url = `http://85.190.242.108:4483/api/ECP/DeleteRange?listOfID=${actionID}`;
  //       const response = await fetch(url, {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         }
  //       });
  
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  
  //       const data = await response.text();
  //       await Swal.fire({
  //         title: 'Success',
  //         text: data,
  //         icon: 'success',
  //       });
  
  //       getExpenceTypesList();
  //       return true; 
  //     } else {
  //       return false; 
  //     }
  //   } catch (error) {
  //     await Swal.fire({
  //       title: 'Error',
  //       text: error.message,
  //       icon: 'error',
  //     });
  //     console.error('Error deleting data:', error);
  //     return false; 
  //   }
  // };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Expence Types' prevPageName='Dashboard' prevRoute='/' />
      <TableThree data={expenceTypes} handleDelete={null} actions={actions} />
    </DefaultLayout>
  );
};

export default ExpenceTypes;