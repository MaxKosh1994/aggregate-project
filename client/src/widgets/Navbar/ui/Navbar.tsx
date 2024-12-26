import styles from './Navbar.module.css';
import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Layout, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { signOutThunk, UserCard } from '@/entities/user';
import { ROUTES } from '@/shared/enums/routes';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import AuthForm from '@/features/auth';

const { Header } = Layout;

export default function Navbar(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [isModalSignInOpen, setIsModalSignInOpen] = useState(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showModalSignIn = (): void => {
    setIsDrawerVisible(false);
    setIsModalSignInOpen(true);
  };

  const showModalSignUp = (): void => {
    setIsDrawerVisible(false);
    setIsModalSignUpOpen(true);
  };

  const handleCancelSignIn = (): void => {
    setIsModalSignInOpen(false);
  };

  const handleCancelSignUp = (): void => {
    setIsModalSignUpOpen(false);
  };

  const signOutHandler = async (): Promise<void> => {
    try {
      await dispatch(signOutThunk()).unwrap();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const toggleDrawer = (): void => {
    setIsDrawerVisible((prev) => !prev);
  };

  const renderButtons = (
    <>
      <Button type="link" onClick={() => navigate(ROUTES.HOME)} className={styles.menuButton}>
        Главная
      </Button>
      {user ? (
        <>
          <UserCard user={user} />
          <Button
            type="primary"
            danger
            onClick={() => signOutHandler()}
            className={styles.menuButton}
          >
            Выход
          </Button>
        </>
      ) : (
        <>
          <Button type="link" onClick={showModalSignIn} className={styles.menuButton}>
            Вход
          </Button>
          <Button type="link" onClick={showModalSignUp} className={styles.menuButton}>
            Регистрация
          </Button>
        </>
      )}
    </>
  );

  return (
    <Header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate(ROUTES.HOME)}>
        <img src="/logo.jpg" width={40} height={40} />
        ShareWish
      </div>
      {isMobile ? (
        <>
          <Button
            type="text"
            icon={<MenuOutlined />}
            className={styles.menuButton}
            onClick={toggleDrawer}
          />
          <Drawer
            title="Меню"
            placement="right"
            onClose={toggleDrawer}
            open={isDrawerVisible}
            className={styles.menu}
          >
            <Space direction="vertical">{renderButtons}</Space>
          </Drawer>
        </>
      ) : (
        <Space>{renderButtons}</Space>
      )}
      {!user && (
        <>
          <Modal title="Вход" open={isModalSignInOpen} footer={null} onCancel={handleCancelSignIn}>
            <AuthForm type="signin" onSuccess={handleCancelSignIn} />
          </Modal>
          <Modal
            title="Регистрация"
            open={isModalSignUpOpen}
            footer={null}
            onCancel={handleCancelSignUp}
          >
            <AuthForm type="signup" onSuccess={handleCancelSignUp} />
          </Modal>
        </>
      )}
    </Header>
  );
}
