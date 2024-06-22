import React from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'

const AllTransactions = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName='All Transactions' prevPageName='Dashboard' prevRoute='/' />
            <div className='flex justify-center items-center text-3xl h-96'>
                All Transactions
            </div>
        </DefaultLayout>
    )
}

export default AllTransactions;