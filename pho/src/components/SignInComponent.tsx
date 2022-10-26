import axios, { AxiosError } from 'axios';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
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

import './SignInComponent.css';

function SignInComponent() {
  const [signInError, setSignInError] = useState('');
  const renderUsernamePlaceholder = (props: FormikProps<any>) => (
    <FormControl>
      <FormLabel fontWeight="400" fontSize="24px" className="form-label">
        Username
      </FormLabel>
      <Center>
        <Input
          {...props}
          background="#FFFFFF"
          borderRadius="5px"
          width="370px"
          height="40px"
          className="form-input"
          type="text"
        />
      </Center>
    </FormControl>
  );

  const renderPasswordPlaceholder = (props: FormikProps<any>) => (
    <FormControl>
      <FormLabel fontWeight="400" fontSize="24px" className="form-label">
        Password
      </FormLabel>
      <Center>
        <Input
          {...props}
          background="#FFFFFF"
          borderRadius="5px"
          width="370px"
          height="40px"
          className="form-input"
          type="password"
        />
      </Center>
    </FormControl>
  );

  const validatePlaceholder = (field: string) => (input: string) => {
    if (input.trim().length === 0) {
      const error = `${field} is required`;
      return error;
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const url: string = 'http://localhost:4000';
      const getSaltResponse = await axios.get(
        `${url}/api/auth/${username}/get_salt`
      );
      const salt: string = getSaltResponse.data.salt;
      const hashedPassword = sha256(password + salt);

      const signInResponse = await axios.post(`${url}/api/auth/login`, {
        username,
        hashedPassword,
      });
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
        onSubmit={async (values, actions) => {
          await signIn(values.username, values.password);
          actions.setSubmitting(false);
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <Field
              name="username"
              as={renderUsernamePlaceholder}
              validate={validatePlaceholder('username')}
            />
            <ErrorMessage name="username" />
            <Field
              name="password"
              as={renderPasswordPlaceholder}
              validate={validatePlaceholder('password')}
            />
            <ErrorMessage name="password" />
            <div>{props.errors}</div>
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
        <Text className="register-text">Register</Text>
      </Center>
    </div>
  );
}

export default SignInComponent;
