'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/app/api.js';

import FormError from './FormError';
import './LoginStyles.css';

import axios from 'axios';
import Cookies from 'js-cookie';


const LIMITS = {
    LOGIN_MIN : 3,
    LOGIN_MAX : 16,
    PASS_MIN : 3,
    PASS_MAX : 64
}

export default function LoginForm() {


    const loginRef = useRef('');
    const passRef= useRef('');
    const router = useRouter()

    const [loginError, setLoginError] = useState('');
    const [passError, setPassError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('')


    function loginValidate(value) {
        const allowedRegex = /[^a-zA-Z0-9]/g;

        if( !value || value.length < LIMITS.LOGIN_MIN || value.length > LIMITS.LOGIN_MAX ) {
            setLoginError(`Login musi mieć od ${LIMITS.LOGIN_MIN} do ${LIMITS.LOGIN_MAX} znaków`)
            return false;
        }
        if( allowedRegex.test(value) ) {
            setLoginError("Użyto niedozwolonego znaku! (bez spacji i symboli)");
            return false;
        }
        setLoginError('');
        return true;
    };

    // function passwordValidate(value) {

    //     if( value.length < LIMITS.PASS_MIN) {
    //         setPassError(`Twoje hasło musi mieć co najmniej ${LIMITS.PASS_MIN} znaki`);
    //         return false;
    //     }
    //     if( value.length > LIMITS.PASS_MAX ) {
    //         setPassError("Twoje hasło jest zbyt długie (maks. 64 znaki");
    //         return false;
    //     }
    //     setPassError('');
    //     return true;
    // };

    async function handleSubmit(e) {
        e.preventDefault()

        const loginValue = loginRef.current.value;
        const passValue = passRef.current.value;

        // const isValid = loginValidate(loginValue) && passwordValidate(passValue);
        const isValid = loginValidate(loginValue)
        if(!isValid) return;

        setIsLoading(true);
        try {
            const data = {
                login: loginValue,
                password: passValue
            };
            const response = await axios.post(`${API.URL}/api/auth/login`, data, {
                withCredentials: true
            });

            if( response.data.success ) {
                // const sessionData = {
                //     user: loginValue,
                //     token: response.data.token,
                //     loginTime: new Date().getTime()
                // };
                // localStorage.setItem('user_session', JSON.stringify(sessionData));
                router.push('/');
            }
        } catch( error ) {
            const message = error?.response?.data?.message || "Błąd połączenia z serwerem"
            setServerError(message);
        } finally {
            setIsLoading(false);
        }

    };

    function clearLoginError() {
        if( loginError ) setLoginError('');
        clearServerError();
    };
    function clearPassError() {
        if( passError ) setPassError('');
        clearServerError();
    };
    function clearServerError() {
        if( serverError ) setServerError('');
    }

    return (
        <div className="login-container">
            <h2 className="login-title">Zaloguj się:</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className='form-row'>
                    <label htmlFor='login'>Login:</label>
                    <input 
                        id='login' 
                        type='text' 
                        // value={login} 
                        onInput={clearLoginError}
                        ref={loginRef}
                        required
                    />
                </div>
                { loginError ? <FormError error={loginError}/> : <></>}

                <div className='form-row'>
                    <label htmlFor='password'>password:</label>
                    <input 
                        id='password' 
                        type='password' 
                        // value={password} 
                        // onInput={clearPassError}
                        ref={passRef}
                        required
                    />
                    {/* { passError ? <FormError error={passError}/> : <></>} */}
                </div>

                <button type='submit' className='login-button' disabled={isLoading}>
                    { isLoading ? 'Logowanie...' : 'Zaloguj się' }
                </button>
                {serverError ? <FormError error={serverError}/> : <></>}
            </form>
        </div>

    )
}