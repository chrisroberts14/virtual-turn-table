import React, { useEffect, useState } from 'react';

const Player = () => {
    const [token, setToken] = useState('');
    const [player, setPlayer] = useState(undefined);
    const [deviceId, setDeviceId] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('spotify_access_token');
        if (storedToken) {
            setToken(storedToken);
            initializePlayer(storedToken);
        }
    }, []);

    const initializePlayer = (token) => {
        // Load the Spotify Web Playback SDK script
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const spotifyPlayer = new window.Spotify.Player({
                name: 'Vite React Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            // Error handling
            spotifyPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
            spotifyPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
            spotifyPlayer.addListener('account_error', ({ message }) => { console.error(message); });
            spotifyPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

            // Playback status updates
            spotifyPlayer.addListener('player_state_changed', state => {
                if (state) {
                    setCurrentTrack(state.track_window.current_track);
                }
            });

            // Ready
            spotifyPlayer.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
                setIsReady(true);
                transferPlaybackHere(device_id, token);
            });

            // Not Ready
            spotifyPlayer.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                setIsReady(false);
            });

            // Connect to the player!
            spotifyPlayer.connect();

            setPlayer(spotifyPlayer);
        };
    };

    const transferPlaybackHere = async (deviceId, token) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "device_ids": [ deviceId ],
                    "play": false,
                }),
            });

            if (response.status === 204) {
                console.log('Successfully transferred playback!');
            } else {
                console.error('Failed to transfer playback.', await response.text());
            }
        } catch (error) {
            console.error('Error transferring playback:', error);
        }
    };

    const playTrack = async () => {
        if (!deviceId) {
            console.error('Device ID is not available');
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    uris: ['spotify:track:YOUR_TRACK_URI'] // Replace with your track URI
                }),
            });

            if (response.status === 204) {
                console.log('Playback started');
            } else {
                console.error('Failed to start playback.', await response.text());
            }
        } catch (error) {
            console.error('Error starting playback:', error);
        }
    };

    const pauseTrack = async () => {
        if (!deviceId) {
            console.error('Device ID is not available');
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 204) {
                console.log('Playback paused');
            } else {
                console.error('Failed to pause playback.', await response.text());
            }
        } catch (error) {
            console.error('Error pausing playback:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Spotify Web Playback SDK</h1>
            <div id="status">
                {isReady ? 'Ready' : 'Not Ready'}
            </div>
            <div style={{ marginTop: '20px' }}>
                <button onClick={playTrack} style={styles.button}>
                    Play
                </button>
                <button onClick={pauseTrack} style={styles.button}>
                    Pause
                </button>
            </div>
            {currentTrack && (
                <div style={{ marginTop: '30px' }}>
                    <h2>Now Playing:</h2>
                    <img src={currentTrack.album.images[0].url} alt={currentTrack.name} width="200" />
                    <h3>{currentTrack.name}</h3>
                    <p>{currentTrack.artists.map(artist => artist.name).join(', ')}</p>
                </div>
            )}
        </div>
    );
};

export default Player;
