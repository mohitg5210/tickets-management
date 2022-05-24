import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import TicketsList from './components/tickets/TicketsList';
import * as routes from './constants/routes';
import { getAccessToken } from './helpers';
import PrivateRoute from './router/PrivateRoute';
import jwt_decode from "jwt-decode";
import { UserTypes } from './constants/common';

function App() {
  const location = useLocation();
  const [userType, setUserType] = useState<UserTypes | null>(null)

  useEffect(() => {
    const getData = async () => {
      const token: any = await getAccessToken()
      const decoded: any = await jwt_decode(token)
      setUserType(decoded.userType)
    }
    setUserType(null)
    getData()
  }, [location]);

  return (
    <Routes>
      <Route path={routes.LOGIN} element={<Login />} />
      {userType === UserTypes.Admin
        ? <>
          <Route path={routes.ROOT} element={<PrivateRoute component={Dashboard} />} />
          <Route path={routes.DASHBOARD} element={<PrivateRoute component={Dashboard} />} />
        </>
        : <Route path={routes.ROOT} element={<PrivateRoute component={TicketsList} />} />
      }
      <Route path={routes.TICKETS} element={<PrivateRoute component={TicketsList} />} />
      <Route path={routes.NOT_FOUND} element={<Navigate to={routes.ROOT} />} />
    </Routes>
  );
}

export default App;
