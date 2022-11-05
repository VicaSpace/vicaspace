import { Field, Form, Formik, FormikProps } from 'formik';
import { sha256 } from 'js-sha256';

import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

import { getRegisterSaltViaAPI, registerViaAPI } from '@/lib/apis/auth';

import './Register.css';

interface RegisterProps {
  onOpenLogin: () => void;
}

export default function Register({ onOpenLogin }: RegisterProps) {
  const [registerError, setRegisterError] = useState('');

  const toast = useToast();

  const extractFormData = (name: string) => {
    switch (name) {
      case 'username':
        return { label: 'Username', type: 'text' };
      case 'password':
        return { label: 'Password', type: 'password' };
      case 'confirmPassword':
        return { label: 'Confirm Password', type: 'password' };
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

  const postRegister = async (username: string, password: string) => {
    try {
      const salt: string = await getRegisterSaltViaAPI();
      const hashedPassword = sha256(password + salt);

      await registerViaAPI(username, salt, hashedPassword);
      await toast({
        title: 'Account created successfully.',
        description:
          "We've created your account for you. Please sign in to continue",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });

      onOpenLogin();
    } catch (error: any) {
      console.log(error.response);
      setRegisterError(error.response.data.error);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Sign up</h1>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        onSubmit={async (values: any, actions: any) => {
          await postRegister(values.username, values.password).catch(
            console.error
          );
          actions.setSubmitting(false);
        }}
        validate={(formValues) => {
          setRegisterError('');
          const password = formValues.password;
          const confirmPassword = formValues.confirmPassword;
          const errors: any = {};
          if (password !== confirmPassword) {
            errors.password = 'Password and Confirm Password must be the same';
          }
          return errors;
        }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <Field name="username" as={renderPlaceHolder} />
            <Field name="password" as={renderPlaceHolder} />
            <Field name="confirmPassword" as={renderPlaceHolder} />
            <div>{props.errors.password as any as string}</div>
            <div>{registerError}</div>
            <div></div>
            <Center>
              <Button
                className="login-button"
                background="#B1B2FF"
                borderRadius="20px"
                width="200px"
                height="55px"
                type="submit"
                isLoading={props.isSubmitting}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => props.submitForm()}
              >
                <Text className="login-text" fontSize="30px">
                  Signup
                </Text>
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
      <Center>
        <Text className="sign-in-text" onClick={onOpenLogin}>
          Login
        </Text>
      </Center>
    </div>
  );
}
