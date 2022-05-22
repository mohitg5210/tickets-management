import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MENU_ROUTES } from '../constants/menuItems';
import * as routes from '../constants/routes';
import { removeAccessToken } from '../helpers';

interface Props {
  children: any
}

const UserLayout = ({ children }: Props) => {
  const { Sider, Content } = Layout;
  const navigate = useNavigate();

  const onClick = async (e: any) => {
    if (e.key === routes.LOGIN) {
      await removeAccessToken()
    }
    navigate(e.key)
  };

  return (
    <div className="main-layout">
      <Layout>
        <Sider className='sider'        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[routes.TICKETS]}
            onClick={onClick}
            items={MENU_ROUTES}
          />
        </Sider>
        <Layout className="site-layout">
          <Content className="site-layout-background"          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default UserLayout;
