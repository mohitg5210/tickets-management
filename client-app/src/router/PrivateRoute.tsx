import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../helpers';
import * as routes from '../constants/routes';
import UserLayout from '../layouts/UserLayout';

const PrivateRoute = ({ component: Component }: any) => {
  const token = getAccessToken()

  if (token) return <UserLayout><Component /></UserLayout>;
  return <Navigate to={routes.LOGIN} />;
};

export default PrivateRoute;