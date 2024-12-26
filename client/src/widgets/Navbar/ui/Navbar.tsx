import React from 'react';
import { Menu, Dropdown, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signOutThunk } from '@/entities/user';
import { ROUTES } from '@/shared/enums/routes';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { UserOutlined } from '@ant-design/icons';

export default function Navbar(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const signOutHandler = async (): Promise<void> => {
    try {
      await dispatch(signOutThunk()).unwrap();
      await navigate(`${ROUTES.AUTH_ROOT}`);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: 'tasks',
          label: 'Задачи',
          onClick: () => navigate(`${ROUTES.HOME}`),
        },
        {
          key: 'logout',
          label: 'Выход',
          onClick: signOutHandler,
          danger: true,
        },
      ]}
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        background: '#f0f0f0',
      }}
    >
      <Space>
        <Button type="primary" onClick={() => navigate(`${ROUTES.HOME}`)}>
          Главная
        </Button>

        {user ? (
          <>
            <Dropdown overlay={userMenu} placement="bottom">
              <Button icon={<UserOutlined />} type="dashed">
                {user.firstName} {user.lastName}
              </Button>
            </Dropdown>
          </>
        ) : (
          <>
            <Button type="primary" onClick={() => navigate(`${ROUTES.AUTH_ROOT}/signin`)}>
              Вход
            </Button>
            <Button type="default" onClick={() => navigate(`${ROUTES.AUTH_ROOT}/signup`)}>
              Регистрация
            </Button>
          </>
        )}
      </Space>
    </div>
  );
}
