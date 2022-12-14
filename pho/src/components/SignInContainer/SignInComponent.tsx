import { AxiosError } from 'axios';
import { Field, Form, Formik, FormikProps } from 'formik';
import { sha256 } from 'js-sha256';

import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';

import { getSaltViaAPI, signInViaAPI } from '@/lib/apis/auth';
import { signIn as signInAction } from '@/states/auth/slice';
import { useAppDispatch } from '@/states/hooks';

import './SignInComponent.css';

interface SignInComponentProps {
  onOpenRegister: () => void;
}

function SignInComponent({ onOpenRegister }: SignInComponentProps) {
  const [signInError, setSignInError] = useState('');
  const dispatch = useAppDispatch();

  const extractFormData = (name: string) => {
    switch (name) {
      case 'username':
        return { label: 'Username', type: 'text' };
      case 'password':
        return { label: 'Password', type: 'password' };
      default:
        return { label: 'Input', type: 'text' };
    }
  };

  const renderPlaceHolder = (props: FormikProps<any>) => {
    const { type, label } = extractFormData((props as any).name);
    return (
      <FormControl isRequired>
        <FormLabel fontWeight="400" fontSize="24px" className="form-label">
          {label}
        </FormLabel>
        <Center>
          <Input
            {...props}
            background="#FFFFFF"
            borderRadius="5px"
            width="370px"
            height="40px"
            className="form-input"
            type={type}
          />
        </Center>
      </FormControl>
    );
  };

  const signIn = async (username: string, password: string) => {
    try {
      const salt: string = await getSaltViaAPI(username);
      const hashedPassword = sha256(password + salt);

      const { accessToken, refreshToken, userId, expiredTime } =
        await signInViaAPI(username, hashedPassword);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('expiredTime', expiredTime);

      dispatch(signInAction({ userId, username }));
    } catch (error: any) {
      if (error instanceof AxiosError) {
        setSignInError(error.response?.data.error);
      } else {
        setSignInError(error.message);
      }
    }
  };

  return (
    <div className="sign-in-component">
      <h1 className="sign-in-title">Sign in</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values: any, actions: any) => {
          await signIn(values.username, values.password);
          actions.setSubmitting(false);
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <Field name="username" as={renderPlaceHolder} />
            <Field name="password" as={renderPlaceHolder} />
            <div>{signInError}</div>
            <Center>
              <Button
                className="login-button"
                background="#B1B2FF"
                borderRadius="20px"
                width="200px"
                height="55px"
                type="submit"
                isLoading={props.isSubmitting}
              >
                <Text className="login-text" fontSize="30px">
                  Login
                </Text>
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
      <Center>
        <Text className="register-text" onClick={onOpenRegister}>
          Register
        </Text>
      </Center>
    </div>
  );
}

export default SignInComponent;
