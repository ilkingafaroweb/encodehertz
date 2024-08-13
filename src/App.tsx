import React from 'react';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Settings';
import Maintenance from './pages/Maintenance/Maintenance';
import Taxi from './pages/Taxi/Taxi';
import Login from './pages/Authentication/Login';
import ForgotPassword from './pages/Authentication/Forgot';
import Reset from './pages/Authentication/Reset';
import ShortOrders from './pages/Bus/ShortOrders/ShortOrders';
import LongOrders from './pages/Bus/LongOrders/LongOrders';
import AddBusLong from './pages/Bus/LongOrders/Actions/Add';
import EditBusLong from './pages/Bus/LongOrders/Actions/Edit';
import PreviewBusLong from './pages/Bus/LongOrders/Actions/Preview';
import DuplicateBusLong from './pages/Bus/LongOrders/Actions/Duplicate';
import ExtraCharges from './pages/ExtraCharge/ExtraCharges';
import AddExtraCharge from './pages/ExtraCharge/Actions/Add';
import EditExtraCharge from './pages/ExtraCharge/Actions/Edit';
import PreviewExtraCharge from './pages/ExtraCharge/Actions/Preview';
import DuplicateExtraCharge from './pages/ExtraCharge/Actions/Duplicate';
import AddBusShort from './pages/Bus/ShortOrders/Actions/Add';
import EditBusShort from './pages/Bus/ShortOrders/Actions/Edit';
import PreviewBusShort from './pages/Bus/ShortOrders/Actions/Preview';
import RentLongOrders from './pages/RentaCar/LongOrders/LongOrders';
import AddRentLong from './pages/RentaCar/LongOrders/Actions/Add';
import EditRentLong from './pages/RentaCar/LongOrders/Actions/Edit';
import PreviewRentLong from './pages/RentaCar/LongOrders/Actions/Preview';
import Sources from './pages/Sources/Sources';
import AddSources from './pages/Sources/Actions/Add';
import EditSources from './pages/Sources/Actions/Edit';
import PreviewSources from './pages/Sources/Actions/Preview';
import RentShortOrders from './pages/RentaCar/ShortOrders/ShortOrders';
import AddRentShort from './pages/RentaCar/ShortOrders/Actions/Add';
import EditRentShort from './pages/RentaCar/ShortOrders/Actions/Edit';
import PreviewRentShort from './pages/RentaCar/ShortOrders/Actions/Preview';
import AddTaxi from './pages/Taxi/Actions/Add';
import EditTaxi from './pages/Taxi/Actions/Edit';
import PreviewTaxi from './pages/Taxi/Actions/Preview';
import RepairTypes from './pages/RepairTypes/RepairTypes';
import AddRepairTypes from './pages/RepairTypes/Actions/Add';
import EditRepairTypes from './pages/RepairTypes/Actions/Edit';
import PreviewRepairTypes from './pages/RepairTypes/Actions/Preview';
import AddMaintenance from './pages/Maintenance/Actions/Add';
import EditMaintenance from './pages/Maintenance/Actions/Edit';
import PreviewMaintenance from './pages/Maintenance/Actions/Preview';
import ExpenceTypes from './pages/ExpenceTypes/ExpenceTypes';
import AddExpenceTypes from './pages/ExpenceTypes/Actions/Add';
import EditExpenceTypes from './pages/ExpenceTypes/Actions/Edit';
import PreviewExpenceTypes from './pages/ExpenceTypes/Actions/Preview';
import Expences from './pages/Expences/Expences';
import AddExpences from './pages/Expences/Actions/Add';
import EditExpences from './pages/Expences/Actions/Edit';
import PreviewExpences from './pages/Expences/Actions/Preview';
import AllTransactions from './pages/AllTransactions/AllTransactions';
import DuplicateBusShort from './pages/Bus/ShortOrders/Actions/Duplicate';
import DuplicateRentLong from './pages/RentaCar/LongOrders/Actions/Duplicate';
import DuplicateRentShort from './pages/RentaCar/ShortOrders/Actions/Duplicate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [userToken, setUserToken] = useState(localStorage.getItem("userId") || '')
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    const handleStorageChange = () => {
      setUserToken(localStorage.getItem("userId"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const privateRoutes = () => (
    <Routes>
      <Route
        path='/'
        element={
          <>
            <PageTitle title="Analytics Dashboard | ENCODE" />
            <ECommerce />
          </>
        }
      />
      <Route
        path="/profile"
        element={
          <>
            <PageTitle title="Profile Settings | ENCODE" />
            <Profile />
          </>
        }
      />

      {/* Bus long orders  */}

      <Route
        path="/bus/long-orders"
        element={
          <>
            <PageTitle title="Bus Long Orders | ENCODE" />
            <LongOrders />
          </>
        }
      />
      <Route
        path="/bus/long-orders/add"
        element={
          <>
            <PageTitle title="Add Bus Long Orders | ENCODE" />
            <AddBusLong />
          </>
        }
      />
      <Route
        path="/bus/long-orders/edit"
        element={
          <>
            <PageTitle title="Add Bus Long Orders | ENCODE" />
            <EditBusLong />
          </>
        }
      />
      <Route
        path="/bus/long-orders/preview"
        element={
          <>
            <PageTitle title="Preview Bus Long Orders | ENCODE" />
            <PreviewBusLong />
          </>
        }
      />
      <Route
        path="/bus/long-orders/duplicate"
        element={
          <>
            <PageTitle title="Duplicate Bus Long Orders | ENCODE" />
            <DuplicateBusLong />
          </>
        }
      />

      {/* Bus short orders  */}

      <Route
        path="/bus/short-orders"
        element={
          <>
            <PageTitle title="Bus Short Orders | ENCODE" />
            <ShortOrders />
          </>
        }
      />
      <Route
        path="/bus/short-orders/add"
        element={
          <>
            <PageTitle title="Add Bus Short Orders | ENCODE" />
            <AddBusShort />
          </>
        }
      />
      <Route
        path="/bus/short-orders/edit"
        element={
          <>
            <PageTitle title="Edit Bus Short Orders | ENCODE" />
            <EditBusShort />
          </>
        }
      />
      <Route
        path="/bus/short-orders/preview"
        element={
          <>
            <PageTitle title="Preview Bus Short Orders | ENCODE" />
            <PreviewBusShort />
          </>
        }
      />
      <Route
        path="/bus/short-orders/duplicate"
        element={
          <>
            <PageTitle title="Duplicate Bus Short Orders | ENCODE" />
            <DuplicateBusShort />
          </>
        }
      />

      {/* Rent a car long orders start */}

      <Route
        path="/car/long-orders"
        element={
          <>
            <PageTitle title="Rentacar Long Orders | ENCODE" />
            <RentLongOrders />
          </>
        }
      />
      <Route
        path="/car/long-orders/add"
        element={
          <>
            <PageTitle title="Add Rentacar Long Orders | ENCODE" />
            <AddRentLong />
          </>
        }
      />
      <Route
        path="/car/long-orders/edit"
        element={
          <>
            <PageTitle title="Edit Rentacar Long Orders | ENCODE" />
            <EditRentLong />
          </>
        }
      />
      <Route
        path="/car/long-orders/preview"
        element={
          <>
            <PageTitle title="Preview Rentacar Long Orders | ENCODE" />
            <PreviewRentLong />
          </>
        }
      />
      <Route
        path="/car/long-orders/duplicate"
        element={
          <>
            <PageTitle title="Duplicate Rentacar Long Orders | ENCODE" />
            <DuplicateRentLong />
          </>
        }
      />

      {/* Rent a car long orders end */}


      <Route
        path="/car/short-orders"
        element={
          <>
            <PageTitle title="Rentacar Short Orders | ENCODE" />
            <RentShortOrders />
          </>
        }
      />
      <Route
        path="/car/short-orders/add"
        element={
          <>
            <PageTitle title="Add Rentacar Short Orders | ENCODE" />
            <AddRentShort />
          </>
        }
      />
      <Route
        path="/car/short-orders/edit"
        element={
          <>
            <PageTitle title="Edit Rentacar Short Orders | ENCODE" />
            <EditRentShort />
          </>
        }
      />
      <Route
        path="/car/short-orders/preview"
        element={
          <>
            <PageTitle title="Preview Rentacar Short Orders | ENCODE" />
            <PreviewRentShort />
          </>
        }
      />
      <Route
        path="/car/short-orders/duplicate"
        element={
          <>
            <PageTitle title="Duplicate Rentacar Short Orders | ENCODE" />
            <DuplicateRentShort />
          </>
        }
      />

      <Route
        path="/maintenance"
        element={
          <>
            <PageTitle title="Maintenance | ENCODE" />
            <Maintenance />
          </>
        }
      />
      <Route
        path="/maintenance/add"
        element={
          <>
            <PageTitle title="Add Maintenance | ENCODE" />
            <AddMaintenance />
          </>
        }
      />
      <Route
        path="/maintenance/edit"
        element={
          <>
            <PageTitle title="Edit Maintenance | ENCODE" />
            <EditMaintenance />
          </>
        }
      />
      <Route
        path="/maintenance/preview"
        element={
          <>
            <PageTitle title="Preview Maintenance | ENCODE" />
            <PreviewMaintenance />
          </>
        }
      />

      {/* Expences */}

      <Route
        path="/expences"
        element={
          <>
            <PageTitle title="Expences | ENCODE" />
            <Expences />
          </>
        }
      />
      <Route
        path="/expences/add"
        element={
          <>
            <PageTitle title="Add Expences | ENCODE" />
            <AddExpences />
          </>
        }
      />
      <Route
        path="/expences/edit"
        element={
          <>
            <PageTitle title="Edit Expences | ENCODE" />
            <EditExpences />
          </>
        }
      />
      <Route
        path="/expences/preview"
        element={
          <>
            <PageTitle title="Preview Expences | ENCODE" />
            <PreviewExpences />
          </>
        }
      />

      {/* Taxi */}

      <Route
        path="/taxi"
        element={
          <>
            <PageTitle title="Taxi | ENCODE" />
            <Taxi />
          </>
        }
      />
      <Route
        path="/taxi/add"
        element={
          <>
            <PageTitle title="Add Taxi | ENCODE" />
            <AddTaxi />
          </>
        }
      />
      <Route
        path="/taxi/edit"
        element={
          <>
            <PageTitle title="Edit Taxi | ENCODE" />
            <EditTaxi />
          </>
        }
      />
      <Route
        path="/taxi/preview"
        element={
          <>
            <PageTitle title="Preview Taxi | ENCODE" />
            <PreviewTaxi />
          </>
        }
      />

      {/* All Transactions */}

      <Route
        path="/allTransactions"
        element={
          <>
            <PageTitle title="All Transactions | ENCODE" />
            <AllTransactions />
          </>
        }
      />

      {/* Extra charges panel */}

      <Route
        path="/extraCharges"
        element={
          <>
            <PageTitle title="Extra Charges | ENCODE" />
            <ExtraCharges />
          </>
        }
      />
      <Route
        path="/extraCharges/add"
        element={
          <>
            <PageTitle title="Add Extra Charges | ENCODE" />
            <AddExtraCharge />
          </>
        }
      />
      <Route
        path="/extraCharges/edit"
        element={
          <>
            <PageTitle title="Edit Extra Charges | ENCODE" />
            <EditExtraCharge />
          </>
        }
      />
      <Route
        path="/extraCharges/preview"
        element={
          <>
            <PageTitle title="Preview Extra Charges | ENCODE" />
            <PreviewExtraCharge />
          </>
        }
      />
      <Route
        path="/extraCharges/duplicate"
        element={
          <>
            <PageTitle title="Duplicate Extra Charges | ENCODE" />
            <DuplicateExtraCharge />
          </>
        }
      />

      {/* Sources */}

      <Route
        path="/sources"
        element={
          <>
            <PageTitle title="Sources | ENCODE" />
            <Sources />
          </>
        }
      />
      <Route
        path="/sources/add"
        element={
          <>
            <PageTitle title="Add Sources | ENCODE" />
            <AddSources />
          </>
        }
      />
      <Route
        path="/sources/edit"
        element={
          <>
            <PageTitle title="Edit Sources | ENCODE" />
            <EditSources />
          </>
        }
      />
      <Route
        path="/sources/preview"
        element={
          <>
            <PageTitle title="Preview Sources | ENCODE" />
            <PreviewSources />
          </>
        }
      />

      {/* Repair Types */}

      <Route
        path="/repairTypes"
        element={
          <>
            <PageTitle title="Repair Types | ENCODE" />
            <RepairTypes />
          </>
        }
      />
      <Route
        path="/repairTypes/add"
        element={
          <>
            <PageTitle title="Add Repair Types | ENCODE" />
            <AddRepairTypes />
          </>
        }
      />
      <Route
        path="/repairTypes/edit"
        element={
          <>
            <PageTitle title="Edit Repair Types | ENCODE" />
            <EditRepairTypes />
          </>
        }
      />
      <Route
        path="/repairTypes/preview"
        element={
          <>
            <PageTitle title="Preview Repair Types | ENCODE" />
            <PreviewRepairTypes />
          </>
        }
      />

      {/* Expence Types */}

      <Route
        path="/expenceTypes"
        element={
          <>
            <PageTitle title="Expence Types | ENCODE" />
            <ExpenceTypes />
          </>
        }
      />
      <Route
        path="/expenceTypes/add"
        element={
          <>
            <PageTitle title="Add Expence Types | ENCODE" />
            <AddExpenceTypes />
          </>
        }
      />
      <Route
        path="/expenceTypes/edit"
        element={
          <>
            <PageTitle title="Edit Repair Types | ENCODE" />
            <EditExpenceTypes />
          </>
        }
      />
      <Route
        path="/expenceTypes/preview"
        element={
          <>
            <PageTitle title="Preview Expence Types | ENCODE" />
            <PreviewExpenceTypes />
          </>
        }
      />


      {/* <Route
      path="/tables"
      element={
        <>
          <PageTitle title="Tables | ENCODE" />
          <Tables />
        </>
      }
    /> */}

      {/* <Route
      path="/chart"
      element={
        <>
          <PageTitle title="Basic Chart | ENCODE" />
          <Chart />
        </>
      }
    /> */}
      {/* <Route
      path="/ui/alerts"
      element={
        <>
          <PageTitle title="Alerts | ENCODE" />
          <Alerts />
        </>
      }
    /> */}
      {/* <Route
      path="/ui/buttons"
      element={
        <>
          <PageTitle title="Buttons | ENCODE" />
          <Buttons />
        </>
      }
    /> */}
      {/* <Route
      path="/auth/signin"
      element={
        <>
          <PageTitle title="Signin | ENCODE" />
          <SignIn />
        </>
      }
    />
    <Route
      path="/auth/signup"
      element={
        <>
          <PageTitle title="Signup | ENCODE" />
          <SignUp />
        </>
      }
    /> */}
      {/* <Route
      path="/calendar"
      element={
        <>
          <PageTitle title="Calendar | ENCODE" />
          <Calendar />
        </>
      }
    /> */}
      {/* <Route
      path="/profile"
      element={
        <>
          <PageTitle title="Profile | ENCODE" />
          <Profile />
        </>
      }
    /> */}
    </Routes>
  )

  const publicRoutes = () => (
    <Routes>
      <Route
        path=''
        element={
          <>
            <PageTitle title="Login | ENCODE" />
            <Login setUserToken={setUserToken} />
          </>
        }
      />
      <Route
        path="/auth/forgotPassword"
        element={
          <>
            <PageTitle title="Forgot Password | ENCODE" />
            <ForgotPassword />
          </>
        }
      />
      <Route
        path="/auth/resetPassword"
        element={
          <>
            <PageTitle title="Reset Password | ENCODE" />
            <Reset />
          </>
        }
      />
    </Routes>
  )

  return loading ? (
    <Loader />
  ) :
    <>
      <ToastContainer position='top-center' toastClassName='w-96' />
      {
        userToken ? privateRoutes() : publicRoutes()
      }
    </>
    ;
}

export default App;
