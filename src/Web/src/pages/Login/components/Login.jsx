import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { userLoginPostFetch } from '../../../actions/Authentication';
import AuthTemplate from '../../../common/components/AuthTemplateHoc';
import TokenChecker from '../../../common/helpers/TokenChecker';
import Logo from '@/components/Logo';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = (props) => {
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
    fieldErrors: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const tokenValidator = TokenChecker();

    if (tokenValidator === true) {
      props.history.push(`/userprofile/${props.currentUserData.userName}`);
    }
  });

  const validate = () => {
    let emailError = '';
    let passwordError = '';

    if (!loginFormData.email) {
      emailError = 'Email cannot be left blank';
    }

    if (!loginFormData.password) {
      passwordError = 'Password cannot be left blank';
    }

    if (emailError || passwordError) {
      setLoginFormData({
        ...loginFormData,
        fieldErrors: {
          email: emailError,
          password: passwordError,
        },
      });

      return false;
    }

    return true;
  };

  const handleChange = (event) => {
    setLoginFormData({
      ...loginFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = validate();
    if (isValid) {
      props.userLoginDataPost(loginFormData);
      setLoginFormData({
        ...loginFormData,
        fieldErrors: {
          email: '',
          password: '',
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Card className="px-8 py-10">
        <div className="mb-8 flex justify-center">
          <Logo className="text-4xl" />
        </div>

        {props.loginErrors ? (
          <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            {Array.isArray(props.loginErrors)
              ? props.loginErrors.map((error, i) => <p key={i}>{error.message}</p>)
              : props.loginErrors}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={loginFormData.email}
            onChange={handleChange}
            className="bg-secondary"
          />
          {loginFormData.fieldErrors.email ? (
            <p className="text-xs text-destructive">{loginFormData.fieldErrors.email}</p>
          ) : null}

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={loginFormData.password}
            onChange={handleChange}
            className="bg-secondary"
          />
          {loginFormData.fieldErrors.password ? (
            <p className="text-xs text-destructive">{loginFormData.fieldErrors.password}</p>
          ) : null}

          <Button type="submit" className="mt-2 w-full">
            Log In
          </Button>
        </form>
      </Card>

      <Card className="py-5 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-primary">
          Sign up
        </Link>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUserData: state.Login.currentUserData,
    loginErrors: state.Login.loginErrors,
  };
};

const mapDispatchToProps = (dispatch) => ({
  userLoginDataPost: (userLoginData) => dispatch(userLoginPostFetch(userLoginData)),
});

export default AuthTemplate(withRouter(connect(mapStateToProps, mapDispatchToProps)(Login)));
