'use client';
import axios from 'axios';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

import { useTranslation } from '@/context/LanguageProvider';
import './CreateUserDialog.css'

export default function CreateUserDialog({ onClose }) {

    const router = useRouter();
    const { lang } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState({
        login: '',
        password: '',
        group: 'user'
    });

    function validateLogin(e) {
        setError('');
        const login = e.target.value;
        const illegalSymbols = /[\\/:*?"<>!#$%^&()@{}\[\]';:".,`~+=|]/;

        if( login.trim().length === 0 ) {
            setError(lang.errors.emptyString);
        } else if( illegalSymbols.test(login) ) {
            setError(lang.errors.illegalSymbols);
        } else {
            setError('');
        }

        setUserData( (prev) => ({ ...prev, login}) );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
            const API_URL = new URL('/api/users/create', baseURL);

            const response = await axios.post(API_URL, userData);

            onClose();
            router.refresh();
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <div className="portal">
            <div className="backdrop" onClick={onClose}></div>
            
            <dialog className="dialog relative" open>
                
                <div className="header">
                    <h3 className="header-title">{lang.settings.users.createUser.title}</h3>
                    <button className="header-closebtn" onClick={onClose}>X</button>
                </div>

                <form onSubmit={handleSubmit} className="create-user-form">

                    <div className="form-row">
                        <label 
                            className="form-label" 
                            htmlFor="login"
                        >{lang.settings.users.createUser.loginLabel}</label>
                        <input 
                            className="form-input" 
                            name="login" 
                            id="login" 
                            type="text" 
                            placeholder="Login" 
                            onChange={(e) => validateLogin(e)}
                        />
                    </div>

                    <div className="form-row">
                        <label 
                            className="form-label" 
                            htmlFor="password"
                        >{lang.settings.users.createUser.passwordLabel}</label>
                        <input 
                            className="form-input" 
                            name="password" 
                            id="password" 
                            type="password" 
                            placeholder="Password" 
                            onChange={(e) => setUserData((p) => ({...p, password: e.target.value }) )}
                        />
                    </div>

                    <div className="form-row">
                        <label className="form-label">{lang.settings.users.createUser.groupLabel}</label>
                        <select name="group" className="form-select">
                            <option value="user">{lang.settings.users.createUser.groups.user}</option>
                            <option value="admin">{lang.settings.users.createUser.groups.admin}</option>
                        </select>
                    </div>

                    {error && <div className="form-row">
                        <div className="error-msg">{error}</div>
                    </div>}

                    <div className="form-footer">
                        <button className="form-btn cancel-btn" type="button" onClick={onClose} >Anuluj</button>
                        <button className="form-btn submit-btn" type="submit" disabled={ error || isLoading || userData.login.length === 0 || userData.password.length === 0} >
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>

            </dialog>
        </div>,
        document.getElementById('dialogs')
    );
}
