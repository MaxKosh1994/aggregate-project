import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, notification } from 'antd';
import {
  UserValidator,
  signInThunk,
  signUpThunk,
  type SignInDataType,
  type SignUpDataType,
} from '@/entities/user';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { ROUTES } from '@/shared/enums/routes';

type Props = {
  type: string;
};

export default function AuthForm({ type }: Props): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.user.loading);

  const onSignInFinish = async (values: SignInDataType): Promise<void> => {
    const normalizedEmail = values.email.toLowerCase();
    try {
      const { isValid, error: validationError } = UserValidator.validateSignIn(values);

      if (!isValid && validationError?.length) {
        throw new Error(validationError as string);
      }

      const resultAction = await dispatch(
        signInThunk({
          email: normalizedEmail,
          password: values.password,
        }),
      );

      unwrapResult(resultAction);

      notification.success({
        message: 'Вход выполнен',
        description: 'Добро пожаловать',
      });

      await navigate(`${ROUTES.HOME}`);
    } catch (error) {
      console.log(error);
    }
  };

  const onSignUpFinish = async (values: SignUpDataType): Promise<void> => {
    const normalizedEmail = values.email.toLowerCase();
    try {
      const { isValid, error: validationError } = UserValidator.validateSignUp(values);

      if (!isValid && validationError?.length) {
        throw new Error(validationError as string);
      }

      const resultAction = await dispatch(
        signUpThunk({
          email: normalizedEmail,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        }),
      );

      unwrapResult(resultAction);

      notification.success({
        message: 'Успешная регистрация',
        description: 'Добро пожаловать',
      });

      await navigate(`${ROUTES.HOME}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      name="auth"
      layout="vertical"
      initialValues={{ remember: true }}
      onFinish={type === 'signin' ? onSignInFinish : onSignUpFinish}
      style={{ width: '400px' }}
    >
      <Form.Item
        name="email"
        required
        hasFeedback
        tooltip="This is a required field"
        rules={[
          { required: true, message: 'Введите email' },
          {
            validator: (_, value) =>
              UserValidator.validateEmail(value)
                ? Promise.resolve()
                : Promise.reject(new Error('Некорректный email')),
          },
        ]}
      >
        <Input placeholder="Введите email" />
      </Form.Item>

      <Form.Item
        name="password"
        hasFeedback
        rules={[
          { required: true, message: 'Введите ваш пароль' },
          {
            validator: async (_, value) => {
              if (UserValidator.validatePassword(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  'Пароль должен быть не менее 8 символов, содержать заглавные и строчные буквы, цифры и специальные символы.',
                ),
              );
            },
          },
        ]}
      >
        <Input.Password placeholder="Введите пароль" />
      </Form.Item>

      {type === 'signup' && (
        <>
          <Form.Item
            name="firstName"
            hasFeedback
            rules={[{ required: true, message: 'Пожалуйста, укажите ваше имя.' }]}
          >
            <Input placeholder="Введите имя" />
          </Form.Item>
          <Form.Item
            name="lastName"
            hasFeedback
            rules={[{ required: true, message: 'Пожалуйста, укажите вашу фамилию.' }]}
          >
            <Input placeholder="Введите Фамилию" />
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {type === 'signup' ? 'Регистрация' : 'Вход'}
        </Button>
      </Form.Item>
    </Form>
  );
}
