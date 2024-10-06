import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Extract the access token from the URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (accessToken) {
            // Store the access token (e.g., in localStorage)
            localStorage.setItem('spotify_access_token', accessToken);
            // Redirect to the main application
            navigate('/player');
        } else {
            // Handle error
            console.error('Access token not found.');
            navigate('/');
        }
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Logging in...</h1>
        </div>
    );
};

export default Callback;
