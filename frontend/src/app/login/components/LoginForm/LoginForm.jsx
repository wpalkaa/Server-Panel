'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';

import FormError from './FormError';
import { useTranslation } from '@/context/LanguageProvider';
import '../../LoginStyles.css';

import axios from 'axios';


const LIMITS = {
    LOGIN_MIN : 3,
    LOGIN_MAX : 20,
    PASS_MIN : 3,
    PASS_MAX : 64
}

export default function LoginForm() {

    const { lang } = useTranslation();

    const router = useRouter()

    const [serverError, setServerError] = useState('')

    function validate(values) {
        const errors = {};
        const allowedRegex = /[^a-zA-Z0-9]/g;
        setServerError('');

        // Login validation
        if( !values.login ) 
            errors.login = lang.errors.noLogin;
        // else if( values.login.length < LIMITS.LOGIN_MIN || values.login.length > LIMITS.LOGIN_MAX) 
        //     errors.login = lang.errors.invalidLoginLength;
        else if( allowedRegex.test(values.login) )
            errors.login = lang.errors.illegalSymbols;

        // Password validation
        if( !values.password )
            errors.password = lang.errors.noPassword;

        return errors;
    };


    const formik = useFormik({
        initialValues: {
            login: '',
            password: ''
    },
        validate,
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: async (values, { setSubmitting }) => {
            setServerError('');

            try {
                const API_URL = new URL(`/api/auth/login`, process.env.NEXT_PUBLIC_SERVER_URL)
                const response = await axios.post(API_URL, values, {
                    withCredentials: true
                });

                if( response.data.success ) {
                    // Got cookie, redirect to home
                    router.push('/');
                    router.refresh();
                };
            } catch( error ) {
                // const message = error?.response?.data?.message || "Błąd połączenia z serwerem"
                const message = lang.errors[error?.response?.data?.message] || lang.errors.server;
                setServerError(message);
            } finally {
                setSubmitting(false);
            };
        }
    });

    return (
        <div className="login-container">
            <h2 className="login-title">{lang.loginPage.title}:</h2>

            <form className="login-form" onSubmit={formik.handleSubmit}>
                <div className='form-row'>
                    <label htmlFor='login'>{lang.loginPage.loginPlaceholder}:</label>
                    <input 
                        id='login' 
                        name="login"
                        type='text'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                </div>
                { formik.touched.login && formik.errors.login ? <FormError error={formik.errors.login}/> : <></>}


                <div className='form-row'>
                    <label htmlFor='password'>{lang.loginPage.passwordPlaceholder}:</label>
                    <input 
                        id='password' 
                        name="password"
                        type='password' 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                    { formik.touched.password && formik.errors.password ? <FormError error={formik.errors.password}/> : <></>}
                </div>


                <button type='submit' className='login-button' disabled={formik.isSubmitting || serverError}>
                    { formik.isSubmitting ? lang.loginPage.loadingButton : lang.loginPage.loginButton }
                </button>
                {serverError ? <FormError error={serverError}/> : <></>}

            </form>
        </div>

    )
}