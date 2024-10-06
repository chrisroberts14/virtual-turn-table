import React from 'react';


const Login = () => {
    const handleLogin = () => {
        const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
        const scope = "streaming user-read-email user-read-private";

        const authUrl = 'https://accounts.spotify.com/authorize' +
            `?response_type=token` +
            `&client_id=${encodeURIComponent(client_id)}` +
            `&scope=${encodeURIComponent(scope)}` +
            `&redirect_uri=${encodeURIComponent(redirect_uri)}`;

        window.location = authUrl;
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Login test</h1>
            <button onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}

export default Login;
