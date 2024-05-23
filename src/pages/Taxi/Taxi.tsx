import React from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'

const Taxi = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName='Taxi'/>
        <div className='flex justify-center items-center h-100'>
            Taxi
        </div>
    </DefaultLayout>
  )
}

export default Taxi;