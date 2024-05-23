import React, { useEffect } from 'react'
import TableThree from '../../../components/Tables/TableThree'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb'
import BusShortData from '../../../data/Bus/ShortOrders'

const ShortOrders = () => {

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Bus Short Orders' prevPageName='Dashboard' prevRoute='/' />
      <TableThree data={BusShortData} handleDelete={null} />
    </DefaultLayout>
  )
}

export default ShortOrders