import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import TicketsList from './components/tickets/TicketsList';
import * as routes from './constants/routes';
import PrivateRoute from './router/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path={routes.LOGIN} element={<Login />} />
      <Route path={routes.ROOT} element={<PrivateRoute component={TicketsList} />} />
      <Route path={routes.TICKETS} element={<PrivateRoute component={TicketsList} />} />
      <Route path={routes.NOT_FOUND} element={<Navigate to={routes.ROOT} />} />
    </Routes>
  );
}

export default App;
