import React from 'react';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Settings';
import Maintenance from './pages/Maintenance/Maintenance';
import Taxi from './pages/Taxi/Taxi';
import Login from './pages/Authentication/Login';
import ForgotPassword from './pages/Authentication/Forgot';
import Reset from './pages/Authentication/Reset';
import ShortOrders from './pages/Bus/ShortOrders/ShortOrders';
import BusShortData from './data/Bus/ShortOrders';
import BusLongData from './data/Bus/LongOrders';
import LongOrders from './pages/Bus/LongOrders/LongOrders';
import AddBusLong from './pages/Bus/LongOrders/Actions/Add';
import EditBusLong from './pages/Bus/LongOrders/Actions/Edit';
import PreviewBusLong from './pages/Bus/LongOrders/Actions/Preview';
import DuplicateBusLong from './pages/Bus/LongOrders/Actions/Duplicate';
import ExtraCharges from './pages/ExtraCharge/ExtraCharges';
import extraChargesData from './data/Extra/ExtraCharges';
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
            <PageTitle title="Add Bus Long Orders | ENCODE" />
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

      {/* Rent a car long orders end */}




      {/*  */}
      <Route
        path="/car/short-orders"
        element={
          <>
            <PageTitle title="Rentacar Short Orders | ENCODE" />
            <FormElements />
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
        path="/taxi"
        element={
          <>
            <PageTitle title="Taxi | ENCODE" />
            <Taxi />
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
      {
        userToken ? privateRoutes() : publicRoutes()
      }
    </>
    ;
}

export default App;
