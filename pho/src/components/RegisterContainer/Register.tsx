import { Field, Formik, FormikProps } from 'formik';

import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';

import './Register.css';

interface RegisterProps {
  onOpenLogin: () => void;
}

export default function Register({ onOpenLogin }: RegisterProps) {
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
    console.log(username, password);
    // dispatch(signIn({username, pass}))
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Sign up</h1>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        onSubmit={async (values: any, actions: any) => {
          console.log('hello');

          await postRegister(values.username, values.password);
          actions.setSubmitting(false);
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <Field name="username" as={renderPlaceHolder} />
            <Field name="password" as={renderPlaceHolder} />
            <Field name="confirmPassword" as={renderPlaceHolder} />
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
