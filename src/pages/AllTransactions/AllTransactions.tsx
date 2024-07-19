import React, { useState, useEffect } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'
import TableThree from '../../components/Tables/TableThree'

const AllTransactions = () => {

    const token = localStorage.getItem('token')
    const [allTransactions, setAllTransactions] = useState([]);
    const [actions, setActions] = useState([])

    const getExpencesList = () => {
        fetch('https://encodehertz.xyz/api/General/Transaction/AllTransactions', {
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
                setAllTransactions(data);
            })
            .catch(error => {
                console.error('Error', error);
            });
    }

    useEffect(() => {
        getExpencesList()
    }, [])

    return (
        <DefaultLayout>
            <Breadcrumb pageName='All Transactions' prevPageName='Dashboard' prevRoute='/' />
            <TableThree data={allTransactions} handleDelete={null} actions={actions}/>
        </DefaultLayout>
    )
}

export default AllTransactions;