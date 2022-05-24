import { Layout, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MENU_ROUTES } from '../constants/menuItems';
import * as routes from '../constants/routes';
import { getAccessToken, removeAccessToken } from '../helpers';
import jwt_decode from "jwt-decode";
import { UserTypes } from '../constants/common';

interface Props {
  children: any
}

const UserLayout = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { Sider, Content } = Layout;
  const [menuItems, setMenuItems] = useState<any[]>([])

  const onClick = async (e: any) => {
    if (e.key === routes.LOGIN) {
      await removeAccessToken()
    }
    navigate(e.key)
  };

  useEffect(() => {
    const getData = async () => {
      const token: any = await getAccessToken()
      const decoded: any = await jwt_decode(token)
      if (decoded.userType === UserTypes.Admin) {
        setMenuItems(MENU_ROUTES)
      } else {
        setMenuItems(MENU_ROUTES.filter(ele => ele.label !== 'Dashboard'))
      }
    }
    getData()
  }, [location]);

  return (
    <div className="main-layout">
      <Layout>
        <Sider className='sider'>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            onClick={onClick}
            items={menuItems}
          />
        </Sider>
        <Layout className="site-layout">
          <Content className="site-layout-background">
            {children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default UserLayout;
