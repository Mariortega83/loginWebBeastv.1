import React, { useState } from 'react';
import './Login.css'; // Asumiendo que tienes un archivo CSS para los estilos
import axios from 'axios';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            email: username,
            password: password
        };

        axios.post('http://localhost:3000/api/auth/login', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Login exitoso:', response.data.token );
                // Maneja el login exitoso, por ejemplo, redirige o muestra un mensaje de éxito
            })
            .catch(error => {
                console.error('Error en el login:', error);
                // Maneja el error del login, por ejemplo, mostrando un mensaje de error
            });

    };

    return (
        <div className="form-container">
            <form className="login-form" onSubmit={handleLogin}>
                <label htmlFor="username" className="form-label">Username</label>
                <input
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                    type="text"
                    placeholder="Username"
                    className="form-input"
                    id="username"
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
