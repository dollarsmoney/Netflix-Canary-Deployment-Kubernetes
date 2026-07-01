import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { userSignUpPostFetch } from '../../../actions/Authentication';
import AuthTemplate from '../../../common/components/AuthTemplateHoc';
import TokenChecker from '../../../common/helpers/TokenChecker';
import Logo from '@/components/Logo';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignUp = (props) => {
  const [signUpFormData, setSignUpFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fieldErrors: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const tokenValidator = TokenChecker();

    if (tokenValidator === true) {
      props.history.push('/userprofile');
    }
  });

  const validate = () => {
    let usernameError = '';
    let emailError = '';
    let passwordError = '';
    let confirmPasswordError = '';

    if (!signUpFormData.username) {
      usernameError = 'Username cannot be left blank';
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(signUpFormData.username)) {
      usernameError =
        'Username must contain at least one uppercase letter, at least one lowercase letter and at least one digit';
    }

    if (!signUpFormData.email) {
      emailError = 'Email cannot be left blank';
    }

    if (!signUpFormData.password) {
      passwordError = 'Password cannot be left blank';
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(signUpFormData.password)) {
      passwordError =
        'Password must contain at least one uppercase letter, at least one lowercase letter and at least one digit';
    } else if (signUpFormData.password <= 12) {
      passwordError = 'Password must be 8 to 12 characters';
    }

    if (!signUpFormData.confirmPassword) {
      confirmPasswordError = 'ConfirmPassword cannot be left blank';
    } else if (signUpFormData.confirmPassword !== signUpFormData.password) {
      confirmPasswordError = "Passwords don't match";
    }

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setSignUpFormData({
        ...signUpFormData,
        fieldErrors: {
          username: usernameError,
          email: emailError,
          password: passwordError,
          confirmPassword: confirmPasswordError,
        },
      });

      return false;
    }

    return true;
  };

  const handleChange = (event) => {
    setSignUpFormData({
      ...signUpFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = validate();
    if (isValid) {
      props.userSignUpDataPost(signUpFormData);
      setSignUpFormData({
        ...signUpFormData,
        fieldErrors: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Card className="px-8 py-8">
        <div className="mb-4 flex justify-center">
          <Logo className="text-4xl" />
        </div>
        <p className="mb-6 text-center text-base font-semibold text-muted-foreground">
          Sign up to see photos and videos from your friends.
        </p>

        {props.signUpErrors ? (
          <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            {Array.isArray(props.signUpErrors)
              ? props.signUpErrors.map((error, i) => <p key={i}>{error.message}</p>)
              : props.signUpErrors}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={signUpFormData.username}
            onChange={handleChange}
            className="bg-secondary"
          />
          {signUpFormData.fieldErrors.username ? (
            <p className="text-xs text-destructive">{signUpFormData.fieldErrors.username}</p>
          ) : null}

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={signUpFormData.email}
            onChange={handleChange}
            className="bg-secondary"
          />
          {signUpFormData.fieldErrors.email ? (
            <p className="text-xs text-destructive">{signUpFormData.fieldErrors.email}</p>
          ) : null}

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={signUpFormData.password}
            onChange={handleChange}
            className="bg-secondary"
          />
          {signUpFormData.fieldErrors.password ? (
            <p className="text-xs text-destructive">{signUpFormData.fieldErrors.password}</p>
          ) : null}

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={signUpFormData.confirmPassword}
            onChange={handleChange}
            className="bg-secondary"
          />
          {signUpFormData.fieldErrors.confirmPassword ? (
            <p className="text-xs text-destructive">{signUpFormData.fieldErrors.confirmPassword}</p>
          ) : null}

          <p className="pt-2 text-center text-xs text-muted-foreground">
            By signing up, you agree to our <strong>Terms &amp; Privacy Policy</strong>
          </p>
          <Button type="submit" className="mt-1 w-full">
            Sign Up
          </Button>
        </form>
      </Card>

      <Card className="py-5 text-center text-sm">
        Already have an account?{' '}
        <Link to="/" className="font-semibold text-primary">
          Log in
        </Link>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    signUpErrors: state.SignUp.signUpErrors,
  };
};

const mapDispatchToProps = (dispatch) => ({
  userSignUpDataPost: (userSignUpData) => dispatch(userSignUpPostFetch(userSignUpData)),
});

export default AuthTemplate(withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp)));
