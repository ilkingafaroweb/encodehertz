import React from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'

const Maintenance = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName='Maintenance'/>
        <div className='flex justify-center items-center h-100'>
            Maintenance
        </div>
    </DefaultLayout>
  )
}

export default Maintenance