import React, { useState, useEffect } from 'react';
import './Login.css'; // Asumiendo que tienes un archivo CSS para los estilos
import axios from 'axios';
import { useAuth, API_URL } from '../../context/AuthContext';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin } = useAuth();

    // useEffect(() => {
    //     const testCall = async () => {
    //         const result = await axios.post(`${API_URL}/api/auth/login`);
    //     }
    //     testCall();
    // }, []);


    const login = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const result = await onLogin!(email, password);
            console.log('Login result:', result);
            if (!result) {
                alert('No psoe');
            } else {
                console.log('Login successful:', result);
            }

        } catch (error) {
            if (error instanceof Error) {
                alert('Error' + error.message);
            } else {
                alert('An unexpected error occurred during login.');
            }
            console.log(error);

        };


    };
    return (
        <div className="form-container">
            <form className="login-form" onSubmit={login}>
                <label htmlFor="email" className="form-label">Email</label>
                <input
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    type="text"
                    placeholder="Email"
                    className="form-input"
                    id="email"
                />

                <label htmlFor="password" className="form-label">Password</label>
                <input
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    id="password"
                />

                <button type="submit" className="form-button">Login</button>
            </form>
        </div>
    );
};

export default Login;
