import React, { useState, useEffect } from 'react';
import TableThree from '../../../components/Tables/TableThree';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import RentLongData from '../../../data/Rentacar/LongOrders'

const RentLongOrders = () => {
  const [carLong, setCarLong] = useState(RentLongData);
  const [update, setUpdate] = useState(false); 

//   const getCarLongList = async () => {
//     const token = await localStorage.getItem("token");

//     fetch('Rent a acar long list api', {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Response didnt success');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setCarLong(data);
//       })
//       .catch(error => {
//         console.error('Error', error);
//       });
//   }

//   useEffect(() => {
//     getCarLongList() 
//   }, [])

  // useEffect(() => {
  //   setUserId();
  // }, [update]);
  
  // const setUserId = async () => {
  //   try {
  //     const userId = await localStorage.getItem('userId');
  //     if (userId) {
  //       const response = await fetch(`https://encodehertz.xyz/api/Long/SetUserId?userId=${userId}`);
  //       if (!response.ok) {
  //         throw new Error('ID didnt set');
  //       }
  //       fetchData();
  //     }
  //   } catch (error) {
  //     console.error('userId set olanda error yarandı', error);
  //   }
  // };
  
  // const fetchData = () => {
  //   fetch('https://encodehertz.xyz/api/Long/List')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Response didnt success');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setBusLong(data);
  //     })
  //     .catch(error => {
  //       console.error('Error', error);
  //     });
  // };
  

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
        const url = `https://encodehertz.xyz/api/Long/Delete?bloId=${actionID}`;
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Accept': '*/*',
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
          setUpdate(prev => !prev); 
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
      <Breadcrumb pageName='Rent a car long orders' prevPageName='Dashboard' prevRoute='/'/>
      {
        carLong.length > 0 && (<TableThree data={carLong} handleDelete={handleDelete} />)
      }
    </DefaultLayout>
  );
}

export default RentLongOrders;